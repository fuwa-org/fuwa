/// <reference types="node" />
import { RequestManager } from '../rest/RequestManager.js';
import { ClientOptions, Snowflake } from './ClientOptions';
import EventEmitter from 'events';
import { GuildManager } from '../structures/managers/GuildManager.js';
import { ILogger } from '../logging/ILogger.js';
import { UserManager } from '../structures/managers/UserManager.js';
import { ExtendedUser } from '../structures/ExtendedUser.js';
import { ChannelManager } from '../structures/managers/ChannelManager.js';
import Events from '@fuwa/events';
import { Message } from '../structures/Message.js';
import { Guild } from '../structures/Guild.js';
import { TextChannel } from '../structures/templates/BaseTextChannel.js';
import { GatewayManager } from '../ws/GatewayManager.js';
import { APIRequest } from '../rest/APIRequest.js';
export declare class Client extends EventEmitter {
    #private;
    http: RequestManager;
    options: Required<ClientOptions>;
    logger: ILogger;
    ws: GatewayManager;
    guilds: GuildManager;
    users: UserManager;
    channels: ChannelManager;
    user: ExtendedUser | null;
    private timeouts;
    private timers;
    constructor(token: string, options?: ClientOptions);
    connect(): Promise<void>;
    token(redact?: boolean): string;
    debug(...data: any[]): void;
    delegate(event: `${string}.${string}`, ...data: any[]): void;
    event(name: string): Events.SubscriptionBuilder<string, any[]>;
    reset(): void;
    get rest(): APIProxy;
    createDM(recipient: Snowflake, cache?: boolean): Promise<import("../index.js").DMChannel>;
}
export interface Client {
    on<K extends keyof ClientEvents>(event: K, listener: (...args: ClientEvents[K]) => void): this;
    on<K extends Exclude<string, keyof ClientEvents>>(event: K, listener: (...args: any[]) => void): this;
}
export interface ClientEvents {
    ready: [];
    resumed: [session_id: string];
    'guilds.create': [Guild];
    'guilds.delete': [id: Snowflake];
    'guilds.update': [old: Guild, new: Guild];
    'messages.create': [Message];
    'messages.delete': [
        {
            guild: Guild | null;
            channel: TextChannel;
            id: Snowflake;
        }
    ];
    'messages.update': [old: Message, new: Message];
}
export declare type Awaitable<T> = Promise<T> | T;
export declare type APIRequestOptions = Omit<APIRequest, 'route'>;
export declare type APIProxy = {
    [key: string]: APIProxy;
} & {
    get<T>(options: APIRequestOptions): Promise<T>;
    post<T>(options: APIRequestOptions): Promise<T>;
    put<T>(options: APIRequestOptions): Promise<T>;
    delete<T>(options: Omit<APIRequestOptions, 'body' | 'files'>): Promise<T>;
} & ((...args: any[]) => APIProxy);
