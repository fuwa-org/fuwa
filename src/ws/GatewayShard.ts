import { AsyncQueue } from '@sapphire/async-queue';
import {
  Snowflake,
  GatewayIdentify,
  GatewayOpcodes,
  GatewayReceivePayload,
  GatewayResume,
  GatewaySendPayload,
} from 'discord-api-types/v10';
import WebSocket from 'ws';
import { Client } from '../client/Client';
import { Intents } from '../util/bitfields/Intents';
import EventEmitter from 'node:events';

/**
 * Typeguard for Erlpack interfaces
 */
export interface Erlpack {
  pack(data: any): Buffer;
  unpack<T>(data: Buffer): T;
}

let erlpack: Erlpack;
try {
  erlpack = require('erlpack');
} catch {
  // it's not installed
}

export enum ShardState {
  Disconnected = 0,
  Connecting,
  Reconnecting,
  Identifying,
  Ready,
  Resuming,
  GuildsReady,
  Available,
}

/**
 * Represents a WebSocket connection to Discord's gateway.
 */
export class GatewayShard extends EventEmitter {
  /** The raw WebSocket connection. */
  private _socket!: WebSocket;
  /** @internal */
  #messageQueue = new AsyncQueue();
  /** @internal */
  private messageQueueCount = 0;
  public compress: boolean;
  public erlpack: boolean;
  public id: number;
  private heartbeat_interval = -1;
  private heartbeat_at = -1;
  private heartbeat_acked = true;
  public url = 'wss://gateway.discord.gg/?v=9&encoding=json';

  /** The latency between us and Discord, in milliseconds. */
  public ping = -1;

  /**
   * The last sequence number received from Discord. Used in heartbeating
   * and to catch up to recieved events when resuming.
   */
  public seq = -1;
  /** The current session ID of the shard. */
  public session?: string;

  /** @internal @ignore */
  _awaitedGuilds: Snowflake[] = null as any;

  /** @internal */
  #timers: NodeJS.Timer[] = [];
  /** @internal */
  #timeouts: NodeJS.Timeout[] = [];

  public state = ShardState.Disconnected;

  constructor(public client: Client, public readonly shard: [number, number]) {
    super();

    this.id = shard[0]!;
    this.compress = client.options.compress;

    if (typeof this.client.options.etf === 'boolean') {
      this.erlpack = this.client.options.etf;
    } else {
      this.erlpack = true;
      erlpack = this.client.options.etf;
    }

    Object.defineProperty(this, 'client', {
      enumerable: false,
      writable: false,
      value: this.client,
    });
  }

  /**
   * Authenticates the shard with the gateway. Do not use while connected,
   * as it will cause the shard to be refreshed.
   */
  private authenticate() {
    if (this.session) {
      this.debugPretty('Resuming...', {
        session: this.session,
        seq: this.seq,
      });
      this.state = ShardState.Resuming;
      this.send(<GatewayResume>{
        op: GatewayOpcodes.Resume,
        d: {
          token: this.client.token(false),
          session_id: this.session,
          seq: this.seq,
        },
      });
    } else {
      this.debugPretty('Identifying...', {
        token: this.client.token(),
        shard: this.shard.join(', '),
        intents: this.client.options.intents,
      });
      this.state = ShardState.Identifying;
      this.send(<GatewayIdentify>{
        op: GatewayOpcodes.Identify,
        d: {
          token: this.client.token(false),
          properties: {
            $browser: this.client.options.wsBrowser,
            $device: this.client.options.wsDevice,
            $os: this.client.options.wsOS,
          },
          compress: this.compress,
          shard: this.shard,
          intents: (this.client.options.intents as Intents).bits,
        },
      });
    }
  }

  /** Open a connection to Discord, using the custom URL if specified. */
  public connect(url = this.url) {
    this.url = url;

    this.state = ShardState.Connecting;

    Object.defineProperty(this, '_socket', {
      enumerable: false,
      value: new WebSocket(url),
    });

    this._socket.on('open', () => {
      this.emit('open', this);
      this.authenticate();
    });
    this._socket.on('message', this.onMessage.bind(this));
    this._socket.on('close', (code, reason) => {
      this.emit('close', code, reason);
      this.state = ShardState.Disconnected;
    });

    return new Promise((res, rej) => {
      this.awaitPacket(p => p.op === GatewayOpcodes.Hello).then(res);
      this.on('close', (code, reason) =>
        rej(new Error(`WebSocket closed: ${code}, ${reason}`)),
      );
      this.on('_refresh', () => rej(new Error('Refreshing')));
    });
  }

  /**
   * Performs a reset of the shard, closing the WebSocket and clearing
   * all state.
   */
  public reset(full = false) {
    if (full) {
      this.close(false);
      this._awaitedGuilds = [];
    }

    this.#messageQueue = new AsyncQueue();
    this.messageQueueCount = 0;
    this.#timers.forEach(t => clearInterval(t));
    this.#timeouts.forEach(t => clearTimeout(t));
    this.heartbeat_interval = -1;
    // to prevent the heartbeater to immediately panic and reconnect, creating an infinite loop
    this.heartbeat_acked = true;
    this._awaitedGuilds = [];
    this.debug('Reset shard');
  }

  #__log_header() {
    return `[${this.client.logger.kleur().blue('WS')} => ${this.client.logger
      .kleur()
      .yellow(this.id.toString())}]`;
  }

  /** @internal @ignore */
  debug(...data: any[]) {
    this.client.debug(this.#__log_header(), ...data);
  }

  /** @internal @ignore */
  trace(...data: any[]) {
    this.client.logger.trace(`[WS => ${this.id}]`, ...data);
  }

  /** @internal @ignore */
  debugPretty(message: string, data: Record<string, any>) {
    this.debug(
      message,
      '\n',
      Object.entries(data)
        .map(([K, V]) => `\t${K}\t\t:\t${V}`)
        .join('\n'),
    );
  }

  /** @internal @ignore */
  warn(...data: any[]) {
    this.client.logger.warn(this.#__log_header(), ...data);
  }

  /** @internal @ignore */
  error(...data: any[]) {
    this.client.logger.error(this.#__log_header(), ...data);
  }

  /** Await a packet of a specific type from the gateway. */
  public awaitPacket(filter: (payload: GatewayReceivePayload) => boolean) {
    return new Promise(res => {
      const handler = (payload: GatewayReceivePayload) => {
        if (filter(payload)) {
          this.removeListener('packet', handler);
          res(payload);
        }
      };

      this.on('packet', handler);
    });
  }

  /** @internal */
  private async onMessage(message: Buffer) {
    let buffer = message;

    if (this.erlpack) {
      buffer = erlpack.unpack(buffer);
    }

    const data: GatewayReceivePayload = this.erlpack
      ? (buffer as unknown as any)
      : JSON.parse(buffer.toString());

    this.emit('packet', data);

    const payload: any = data.d;

    switch (data.op) {
      case GatewayOpcodes.Hello: {
        this.heartbeat_interval = payload.heartbeat_interval;
        this.trace(
          'commencing heartbeating with interval of',
          this.heartbeat_interval,
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

        this.trace('heartbeat acked with ping of ' + this.ping + 'ms');

        break;
      }
      case GatewayOpcodes.Reconnect: {
        this.trace('received reconnect opcode');

        this.reconnect();

        break;
      }
      case GatewayOpcodes.InvalidSession: {
        this.debug('invalid session passed');
        this.emit('_refresh');
        this.emit('invalidSession');

        break;
      }
      case GatewayOpcodes.Dispatch: {
        this.trace('received dispatch', data.t);

        this.emit('dispatch', data);

        break;
      }
    }

    if (data.s) {
      this.seq = data.s;
    }
  }

  ready() {
    if (this.state === ShardState.Available || this._awaitedGuilds.length) {
      return true;
    }

    this.state = ShardState.Available;
    this.emit('ready');
  }

  /**
   * Send a packet to the {@link GatewayShard._socket|socket}. Use at your own risk, as improperly
   * formatted packets can cause the gateway to disconnect.
   */
  public async send(packet: GatewaySendPayload) {
    if (!this._socket)
      throw new Error("GatewayShard#send called when shard wasn't connected");

    if (this.readyState !== WebSocket.OPEN) {
      await new Promise(resolve => this._socket.once('open', resolve));
    }

    this.messageQueueCount++;
    // aaaaaaa
    await this.#messageQueue.wait();

    if (this.messageQueueCount === 0) {
      // we can't send this message
      return;
    }

    let data: Buffer;

    if (this.erlpack) {
      data = erlpack.pack(packet);
    } else {
      data = Buffer.from(JSON.stringify(packet));
    }

    this._socket!.send(data);

    this.#messageQueue.shift();
    this.messageQueueCount--;
  }

  /**
   * Send a heartbeat through the {@link GatewayShard._socket|socket}. Use at your own risk.
   *
   * **Warning**: if you use this too soon after previously heartbeating, the internal property {@link GatewayShard.heartbeat_acked} may not be set correctly, causing the shard to assume a dead connection and close the socket.
   */
  public heartbeat() {
    if (this.seq <= 0) return;

    if (!this.heartbeat_acked) {
      this.reconnect();
    }

    this.heartbeat_at = Date.now();

    this.send({
      op: GatewayOpcodes.Heartbeat,
      d: this.seq,
    });

    this.heartbeat_acked = false;

    this.trace('sent heartbeat, seq ' + this.seq);

    this.#timeouts.push(
      setTimeout(() => {
        if (!this.heartbeat_acked) {
          this.debug('closing due to heartbeat timeout');
          this.reconnect();
        }
      }, 10e3),
    );
  }

  /**
   * Close the connection to Discord.
   * @param resume Whether to keep the session ID and sequence intact.
   */
  public close(resume = true) {
    switch (this._socket?.readyState) {
      case WebSocket.OPEN:
        this._socket?.removeAllListeners();
        this._socket?.close(resume ? 4000 : 1000, 'Closed by user');
        break;
      default:
        break;
    }

    if (!resume) {
      this.session = undefined;
      this.seq = -1;
    }

    this.#timers.forEach(t => clearInterval(t));
    this.#timeouts.forEach(t => clearInterval(t));
  }

  /** Reconnect to the gateway. */
  public reconnect() {
    this.emit('reconnect');

    this.close(true);
    this.connect(this.url);

    this.state = ShardState.Reconnecting;
  }

  /** @internal */
  private startHeartbeat() {
    this.#timers.push(
      setInterval(this.heartbeat.bind(this), this.heartbeat_interval),
    );
    this.#timeouts.push(
      setTimeout(
        this.heartbeat.bind(this),
        this.heartbeat_interval * Math.random(),
      ),
    );
  }

  /** @internal @ignore */
  setTimeout(func: (...args: any[]) => any, timeout: number) {
    return this.#timeouts.push(setTimeout(func, timeout));
  }
}
