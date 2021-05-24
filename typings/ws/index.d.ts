/// <reference types="node" />
import { EventEmitter } from 'events';
import WebSocket from 'ws';
import { Client } from '../client';
export declare class WebSocketManager extends EventEmitter {
    client: Client;
    gatewayVersion: number;
    lastSequence: number;
    session: string;
    shardId: number;
    socket: WebSocket;
    constructor(client: Client);
    private _addListeners;
    connect(): Promise<string>;
    destroy(): void;
    identify(resuming?: boolean, options?: IdentifyOptions): void;
    seq(): number;
}
export interface IdentifyOptions {
    seq?: number;
    session?: string;
}
