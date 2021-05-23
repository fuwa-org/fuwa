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
    private _connect;
private _request;
intervals: NodeJS.Timeout[];
options: ClientOptions;
    rest: RESTManager;
    timeouts: NodeJS.Timeout[];
token: string;
user: User;
ws: WebSocketManager;
    
    
    

    
    


constructor(token: string, options: ClientOptions);
    get connect(): WebSocketManager["connect"];
destroy(): void;
    get request(): RESTManager["request"];
    
    
    
}
