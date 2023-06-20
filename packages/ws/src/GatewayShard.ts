import { AsyncQueue } from '@sapphire/async-queue';
import {
  GatewayIdentify,
  GatewayOpcodes,
  GatewayReceivePayload,
  GatewayResume,
  GatewaySendPayload,
  Snowflake,
} from 'discord-api-types/v10';
import EventEmitter from 'node:events';
import WebSocket from 'ws';
import { WebSocketProperties } from './Constants.js';

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
  #token: string;
  /** @internal */
  private messageQueueCount = 0;
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

  constructor(
    public readonly shard: [number, number],
    public readonly intents: number,
    token: string,
  ) {
    super();

    this.id = shard[0]!;
    this.#token = token;
  }

  /**
   * Authenticates the shard with the gateway. Do not use while connected,
   * as it will cause the shard to be refreshed.
   */
  private authenticate() {
    if (this.session) {
      this.state = ShardState.Resuming;
      this.send(<GatewayResume>{
        op: GatewayOpcodes.Resume,
        d: {
          token: this.#token,
          session_id: this.session,
          seq: this.seq,
        },
      });
    } else {
      this.state = ShardState.Identifying;
      this.send(<GatewayIdentify>{
        op: GatewayOpcodes.Identify,
        d: {
          token: this.#token,
          properties: WebSocketProperties,
          compress: false,
          shard: this.shard,
          intents: this.intents,
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
    const buffer = message,
      data: GatewayReceivePayload = JSON.parse(buffer.toString());

    this.emit('packet', data);

    const payload: any = data.d;

    switch (data.op) {
      case GatewayOpcodes.Hello: {
        this.heartbeat_interval = payload.heartbeat_interval;

        this.startHeartbeat();
        this.emit('hello', this.heartbeat_interval);

        break;
      }
      case GatewayOpcodes.Heartbeat: {
        this.heartbeat();

        break;
      }
      case GatewayOpcodes.HeartbeatAck: {
        this.heartbeat_acked = true;
        this.ping = Date.now() - this.heartbeat_at;

        break;
      }
      case GatewayOpcodes.Reconnect: {
        this.reconnect();

        break;
      }
      case GatewayOpcodes.InvalidSession: {
        this.emit('_refresh');
        this.emit('invalidSession');

        break;
      }
      case GatewayOpcodes.Dispatch: {
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

    if (this._socket.readyState !== WebSocket.OPEN) {
      await new Promise(resolve => this._socket.once('open', resolve));
    }

    this.messageQueueCount++;
    // aaaaaaa
    await this.#messageQueue.wait();

    if (this.messageQueueCount === 0) {
      // we can't send this message
      return;
    }

    const data = Buffer.from(JSON.stringify(packet));

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

    this.#timeouts.push(
      setTimeout(() => {
        if (!this.heartbeat_acked) {
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
    return this.#timeouts.push(
      setTimeout(func, timeout) as any as NodeJS.Timeout,
    );
  }
}
