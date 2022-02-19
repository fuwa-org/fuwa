/// <reference types="node" />
import { RequestManager } from '../rest/RequestManager.js';
import { ClientOptions } from './ClientOptions';
import EventEmitter from 'events';
import { GatewayShard } from '../ws/GatewayShard.js';
export declare class Client extends EventEmitter {
    #private;
    http: RequestManager;
    options: Required<ClientOptions>;
    ws?: GatewayShard;
    constructor(token: string, options?: ClientOptions);
    connect(): Promise<void>;
    private constructGatewayURL;
    debug(...data: any[]): void;
}
export interface Client extends EventEmitter {
    on<T extends keyof ClientEvents>(event: T, ...data: ClientEvents[T]): this;
    on<T extends Exclude<String, keyof ClientEvents>>(event: T, data: any[]): this;
    once<T extends keyof ClientEvents>(event: T, ...data: ClientEvents[T]): this;
    once<T extends Exclude<String, keyof ClientEvents>>(event: T, data: any[]): this;
    addEventListener<T extends keyof ClientEvents>(event: T, ...data: ClientEvents[T]): this;
    addEventListener<T extends Exclude<String, keyof ClientEvents>>(event: T, data: any[]): this;
}
export interface ClientEvents {
    debug: any[];
}
