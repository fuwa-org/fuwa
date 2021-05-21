/// <reference types="node" />
import { EventEmitter } from "events";
import { RESTManager } from "./rest";
import { User } from "./structures/User";
import { WebSocketManager } from "./ws";
export interface ClientOptions {
    intents: number;
}
export interface Client {
    token: string;
}
export declare class Client extends EventEmitter {
    options: ClientOptions;
    rest: RESTManager;
    ws: WebSocketManager;
    user: User;
    intervals: NodeJS.Timeout[];
    token: string;
    timeouts: NodeJS.Timeout[];
    constructor(token: string, options: ClientOptions);
    destroy(): void;
    get request(): RESTManager["request"];
    get connect(): WebSocketManager["connect"];
    private _request;
    private _connect;
}
