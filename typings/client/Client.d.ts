/// <reference types="node" />
import { RequestManager } from '../rest/RequestManager.js';
import { ClientOptions, Snowflake } from './ClientOptions';
import EventEmitter from 'events';
import { GatewayShard } from '../ws/GatewayShard.js';
import { GuildManager } from '../structures/managers/GuildManager.js';
import { Guild } from '../structures/Guild.js';
import { ILogger } from '../logging/ILogger.js';
export declare class Client extends EventEmitter {
    #private;
    http: RequestManager;
    options: Required<ClientOptions>;
    logger: ILogger;
    ws?: GatewayShard;
    guilds: GuildManager;
    constructor(token: string, options?: ClientOptions);
    connect(): Promise<void>;
    private constructGatewayURL;
    debug(...data: any[]): void;
}
export interface Client extends EventEmitter {
    on<T extends keyof ClientEvents>(event: T, listener: (...data: ClientEvents[T]) => Awaitable<void>): this;
    on<T extends Exclude<string, keyof ClientEvents>>(event: T, listener: (...data: any[]) => Awaitable<void>): this;
    once<T extends keyof ClientEvents>(event: T, listener: (...data: ClientEvents[T]) => Awaitable<void>): this;
    once<T extends Exclude<string, keyof ClientEvents>>(event: T, listener: (...data: any[]) => Awaitable<void>): this;
    addEventListener<T extends keyof ClientEvents>(event: T, listener: (...data: ClientEvents[T]) => Awaitable<void>): this;
    addEventListener<T extends Exclude<string, keyof ClientEvents>>(event: T, listener: (...data: any[]) => Awaitable<void>): this;
}
export interface ClientEvents {
    debug: any[];
    ready: [];
    guildCreate: [Guild];
    guildUpdate: [old: Guild, new: Guild];
    guildDelete: [id: Snowflake];
}
export declare type Awaitable<T> = Promise<T> | T;
