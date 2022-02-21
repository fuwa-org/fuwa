import { Client } from '../client/Client';
import WebSocket from 'ws';
import { AsyncQueue } from '@sapphire/async-queue';
import {
  GatewayIdentify,
  GatewayOpcodes,
  GatewayResume,
  GatewaySendPayload,
  GatewayCloseCodes,
  GatewayReceivePayload,
  GatewayDispatchPayload,
  GatewayDispatchEvents,
  GatewayReadyDispatchData,
  GatewayResumedDispatch,
  GatewayGuildCreateDispatch,
} from '@splatterxl/discord-api-types';
import { Intents } from './intents';
import { Snowflake } from '../client/ClientOptions';
import { Guild } from '../structures/Guild';

interface Erlpack {
  pack(data: any): Buffer;
  unpack<T>(data: Buffer): T;
}

let erlpack: Erlpack;
try {
  erlpack = require('erlpack');
} catch {
  // it's not installed
}

/** A shard connection the Discord gateway. */
export class GatewayShard {
  private _socket?: WebSocket;
  #messageQueue = new AsyncQueue();
  #token: string;
  public compress: boolean;
  public erlpack: boolean;
  public id: number;
  private heartbeat_interval = -1;
  private heartbeat_at = -1;
  private heartbeat_acked = true;
  private url = 'wss://gateway.discord.gg/?v=9&encoding=json';

  /** The latency between us and Discord, in milliseconds. */
  public ping = -1;

  private s = -1;
  public session?: string;

  private _awaitedGuilds: Snowflake[] = [];

  #timers: NodeJS.Timer[] = [];
  #timeouts: NodeJS.Timeout[] = [];

  constructor(
    public client: Client,
    public readonly shard: [number, number],
    token: string
  ) {
    this.id = shard[0]!;
    this.compress = client.options.compress;
    this.erlpack = client.options.etf;

    this.#token = token;
  }

  private authenticate() {
    if (this.session) {
      this.send(<GatewayResume>{
        op: GatewayOpcodes.Resume,
        d: {
          token: this.#token,
          session_id: this.session,
          seq: this.s,
        },
      });
    } else {
      this.send(<GatewayIdentify>{
        op: GatewayOpcodes.Identify,
        d: {
          token: this.#token,
          properties: {},
          compress: this.compress,
          shard: this.shard,
          intents: (this.client.options.intents as Intents).bits,
        },
      });
    }
  }

  /** Opens a connection to Discord. */
  public async connect(url = this.url) {
    this.url = url;

    this._socket = new WebSocket(url);

    this._socket.on('open', () => {
      this.authenticate();
    });
    this._socket.on('message', this.onMessage.bind(this));
    this._socket.on('close', (code, reason) => {
      this.debug(
        `Gateway closed with code`,
        code,
        `reason`,
        reason?.toString() ?? GatewayCloseCodes[code]
      );
      switch (code) {
        case GatewayCloseCodes.InvalidIntents:
          throw new Error(
            `Gateway intents ${this.client.options.intents} are invalid.`
          );
        case GatewayCloseCodes.InvalidShard:
          throw new Error('Invalid shard passed to GatewayShard');
        case GatewayCloseCodes.DisallowedIntents:
          throw new Error(
            `Gateway intents ${this.client.options.intents} are disallowed for the client.`
          );
        case GatewayCloseCodes.AuthenticationFailed:
          throw new Error('Client token is invalid');
        case 1000:
          break;
        case GatewayCloseCodes.InvalidSeq:
        case GatewayCloseCodes.SessionTimedOut:
          this.reset();
        // eslint-disable-next-line no-fallthrough
        default:
          this.debug('Socket closed, reconnecting...');
          this.connect(url);
          break;
      }
    });
  }

  private reset() {
    this.close(false);
    this._socket = undefined;
    this.#messageQueue = new AsyncQueue();
    this.#timers.forEach((t) => clearInterval(t));
    this.#timeouts.forEach((t) => clearTimeout(t));
    this.heartbeat_interval = -1;
  }

  private debug(...data: any[]) {
    this.client.emit('debug', `[WS => ${this.id}]`, ...data);
  }

  private debugPretty(message: string, data: Record<string, any>) {
    this.debug(
      message,
      '\n',
      Object.entries(data)
        .map(([K, V]) => `\t${K}\t\t:\t${V}`)
        .join('\n')
    );
  }

  private onMessage(message: Buffer) {
    let buffer = message;

    if (this.erlpack) {
      buffer = erlpack.unpack(buffer);
    }

    const data: GatewayReceivePayload = this.erlpack
      ? (buffer as unknown as any)
      : JSON.parse(buffer.toString());

    const payload: any = data.d;

    if (data.s) {
      this.s = data.s;
    }

    switch (data.op) {
      case GatewayOpcodes.Hello: {
        this.heartbeat_interval = payload.heartbeat_interval;
        this.debug(
          'commencing heartbeating with interval of',
          this.heartbeat_interval
        );
        this.startHeartbeat();

        break;
      }
      case GatewayOpcodes.Heartbeat: {
        this.heartbeat();

        break;
      }
      case GatewayOpcodes.HeartbeatAck: {
        this.heartbeat_acked = true;
        this.ping = Date.now() - this.heartbeat_at;

        this.debug('heartbeat acked with ping of ' + this.ping + 'ms');

        break;
      }
      case GatewayOpcodes.Reconnect: {
        this.reconnect();

        break;
      }
      case GatewayOpcodes.InvalidSession: {
        this.debug('invalid session passed');
        this.close(false);
        this.reset();
        this.connect();

        break;
      }
      case GatewayOpcodes.Dispatch: {
        let event = payload as GatewayDispatchPayload['d'];

        this.debug('dispatch', data.t, 'received');

        switch (data.t) {
          case GatewayDispatchEvents.Ready: {
            event = event as GatewayReadyDispatchData;

            this.session = event.session_id;
            this._awaitedGuilds = event.guilds.map((v) => v.id as Snowflake);

            this.debugPretty('ready for user ' + event.user.id, {
              session: this.session,
              shard: '[' + event.shard?.join(', ') + ']',
              guilds: event.guilds?.length,
            });
            break;
          }
          case GatewayDispatchEvents.Resumed: {
            event = event as GatewayResumedDispatch['d'];

            this.debug('resumed session ', this.session);

            break;
          }
          case GatewayDispatchEvents.GuildCreate: {
            const data = event as GatewayGuildCreateDispatch['d'];
            this.client.guilds.add(
              new Guild(this.client, data)._deserialise(data)
            );

            if (this._awaitedGuilds.includes(data.id as Snowflake)) {
              this._awaitedGuilds = this._awaitedGuilds.filter(
                (v) => v !== data.id
              );

              if (this._awaitedGuilds.length === 0) {
                this.client.emit('ready');
              }
            } else {
              this.client.emit(
                'guildCreate',
                this.client.guilds.cache.get(data.id as Snowflake)
              );
            }
          }
        }

        break;
      }
    }
  }

  /**
   * Send a packet to the {@link GatewayShard._socket|socket}. Use at your own risk.
   * @internal
   */
  public async send(packet: GatewaySendPayload) {
    if (!this._socket)
      throw new Error("GatewayShard#send called when shard wasn't connected");

    // aaaaaaa
    await this.#messageQueue.wait();

    let data: Buffer;

    if (this.erlpack) {
      data = erlpack.pack(packet);
    } else {
      data = Buffer.from(JSON.stringify(packet));
    }

    this._socket!.send(data);

    this.#messageQueue.shift();
  }

  /**
   * Send a heartbeat through the {@link GatewayShard._socket|socket}. Use at your own risk.
   *
   * **Warning**: if you use this too soon after previously heartbeating, the internal property {@link GatewayShard.heartbeat_acked} may not be set correctly, causing the shard to assume a dead connection and close the socket.
   */
  public heartbeat() {
    if (!this.heartbeat_acked) {
      this.reconnect();
    }

    this.heartbeat_at = Date.now();

    this.send({
      op: GatewayOpcodes.Heartbeat,
      d: this.s,
    });

    this.heartbeat_acked = false;

    this.debug('sent heartbeat, seq ' + this.s);

    this.#timeouts.push(
      setTimeout(() => {
        if (!this.heartbeat_acked) {
          this.reconnect();
        }
      }, 10e3)
    );
  }

  /**
   * Close the connection to Discord.
   * @param resume Whether to keep the session ID and sequence intact.
   */
  public close(resume = true) {
    this.debug('closing socket');

    this._socket?.close(resume ? GatewayCloseCodes.UnknownError : 1000);

    if (!resume) {
      this.session = undefined;
      this.s = -1;
    }

    this.#timers.forEach((t) => clearInterval(t));
    this.#timeouts.forEach((t) => clearInterval(t));
  }

  public reconnect() {
    this.close(true);
  }

  private startHeartbeat() {
    this.#timers.push(
      setInterval(this.heartbeat.bind(this), this.heartbeat_interval)
    );
    this.#timeouts.push(
      setTimeout(
        this.heartbeat.bind(this),
        this.heartbeat_interval * Math.random()
      )
    );
  }
}
