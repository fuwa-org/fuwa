/// <reference types="node" />
import { GatewayReceivePayload } from "discord-api-types";
import { EventEmitter } from "events";
import WebSocket from "ws";
import { Client } from "../client";
export declare class WebSocketManager extends EventEmitter {
    socket: WebSocket;
    client: Client;
    lastSequence: number;
    on: (event: "message", handler: (data: GatewayReceivePayload) => void) => this;
    constructor(client: Client);
    seq(): number;
    connect(): Promise<string>;
    private _addListeners;
}
