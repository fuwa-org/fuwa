import { Client } from '../client/Client';
import WebSocket from 'ws';
import { AsyncQueue } from '@sapphire/async-queue';
import {
  GatewayIdentify,
  GatewayOpcodes,
  GatewayResume,
  GatewaySendPayload,
  GatewayCloseCodes,
  GatewayDispatchPayload,
} from '@splatterxl/discord-api-types';
import { Intents } from './intents';

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

  private s = -1;
  public session?: string;

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
  public async connect(url: string) {
    this._socket = new WebSocket(url);

    this._socket.once('open', () => {
      this.debug('connected, sending IDENTIFY');

      this.authenticate();
    });
    this._socket.on('message', this.onMessage.bind(this));
    this._socket.on('close', (code, reason) => {
      this.debug(`Gateway closed with code`, code, `reason`, reason.toString());
      switch (code) {
        case 1000:
          throw new Error(
            `Gateway closed with code 1000: ` + reason.toString()
          );
        case GatewayCloseCodes.InvalidIntents:
          throw new Error(
            `Gateway intents ${this.client.options.intents} are invalid.`
          );
        default:
      }
    });
  }

  private debug(...data: any[]) {
    this.client.emit('debug', `[WS => ${this.id}]`, ...data);
  }
  private onMessage(message: Buffer) {
    let buffer = message;

    if (this.erlpack) {
      buffer = erlpack.unpack(buffer);
    }

    const data: GatewayDispatchPayload = this.erlpack
      ? (buffer as unknown as any)
      : JSON.parse(buffer.toString());

    this.debug(data.op, data.t, data.s);
  }

  /**
   * Send a packet to the {@link Client._socket|socket}. Use at your own risk.
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

    this.debug(`Sent opcode ${packet.op} (${GatewayOpcodes[packet.op]})`);
  }
}
