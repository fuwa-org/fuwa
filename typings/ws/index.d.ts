/// <reference types="node" />
import { GatewayReceivePayload } from 'discord-api-types';
import { EventEmitter } from 'events';
import WebSocket from 'ws';
import { Client } from '../client';
export declare class WebSocketManager extends EventEmitter {
  private _addListeners;
  client: Client;
  lastSequence: number;
  socket: WebSocket;

  constructor(client: Client);
  connect(): Promise<string>;
  seq(): number;
  on: (
    event: 'message',
    handler: (data: GatewayReceivePayload) => void
  ) => this;
}
