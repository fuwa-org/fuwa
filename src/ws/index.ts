import {
  APIGatewayBotInfo,
  GatewayDispatchPayload,
  GatewayIdentify,
  GatewayOPCodes,
  GatewayReceivePayload,
} from 'discord-api-types';
import { EventEmitter } from 'events';
import { readdirSync } from 'fs';
import { join as pathDotJoin } from 'path';
import WebSocket from 'ws';
import { Client } from '../client';
import { CONSTANTS, ERRORS } from '../constants';
import { message } from './events';
export class WebSocketManager extends EventEmitter {
  client: Client;
  lastSequence = 0;
  socket!: WebSocket;

  constructor(client: Client) {
    super();
    this.client = client;
  }
  private async _addListeners(): Promise<void> {
    this.on('message', message.bind(null, this));
    for (const file of [
      ...readdirSync(pathDotJoin(__dirname, '..', 'events')).filter(
        (v) => v !== 'opcodes'
      ),
      ...readdirSync(pathDotJoin(__dirname, '..', 'events', 'opcodes')).map(
        (v) => pathDotJoin('opcodes', v)
      ),
    ].filter((v) => !v.endsWith('.d.ts'))) {
      const { default: data } = await import(
        pathDotJoin(__dirname, '..', 'events', file)
      );
      const func = data;
      const event = file.replace(/(^opcodes\/|\.js$)/g, '');
      this.on('message', (data: GatewayReceivePayload) => {
        if (data.op === +event || (data as GatewayDispatchPayload).t === event)
          func(this, data);
      });
    }
    this.socket.on('close', (code, reason) => {
      console.error('Socket closed with code', code, 'and reason', reason);
    });
  }
  async connect(): Promise<string> {
    const { token } = this.client;
    if (!token || !token.length) throw ERRORS.NO_TOKEN;
    const prelimInfo = await this.client.request<void, APIGatewayBotInfo>(
      CONSTANTS.getUrl('getGatewayBot'),
      { rawUrl: true }
    );
    const { data } = prelimInfo;
    if (data.shards > 1) {
      (async () => {
        throw ERRORS.SHARDING;
      })().then(() => process.exit(1));
    }
    if (!prelimInfo.res.ok) throw ERRORS.NO_TOKEN;
    this.socket = new WebSocket(CONSTANTS.urls.socketUrl);
    this.socket.on('message', (data) => {
      data = data.toString();
      try {
        data = JSON.parse(data);
      } catch {} // eslint-disable-line no-empty
      this.emit('message', data);
    });
    this.socket.on('open', () =>
      this.socket.send(
        JSON.stringify({
          op: GatewayOPCodes.Identify,
          d: {
            token: this.client.token,
            properties: CONSTANTS.api.gatewayProperties,
            intents: this.client.options.intents,
          },
        } as GatewayIdentify)
      )
    );
    this._addListeners();
    return this.client.token;
  }
  seq(): number {
    return this.lastSequence;
  }
  declare on: (
    event: 'message',
    handler: (data: GatewayReceivePayload) => void
  ) => this;
}
