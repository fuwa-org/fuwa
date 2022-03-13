/// <reference types="node" />
import { RequestManager } from '../rest/RequestManager.js';
import { ClientOptions } from './ClientOptions';
import EventEmitter from 'events';
import { GatewayShard } from '../ws/GatewayShard.js';
import { GuildManager } from '../structures/managers/GuildManager.js';
import { ILogger } from '../logging/ILogger.js';
import { UserManager } from '../structures/managers/UserManager.js';
import { ExtendedUser } from '../structures/ExtendedUser.js';
import { ChannelManager } from '../structures/managers/ChannelManager.js';
import Events from '@fuwa/events';
export declare class Client extends EventEmitter {
    #private;
    http: RequestManager;
    options: Required<ClientOptions>;
    logger: ILogger;
    ws?: GatewayShard;
    guilds: GuildManager;
    users: UserManager;
    channels: ChannelManager;
    user: ExtendedUser | null;
    constructor(token: string, options?: ClientOptions);
    connect(): Promise<void>;
    private constructGatewayURL;
    debug(...data: any[]): void;
    delegate(event: `${string}.${string}`, ...data: any[]): void;
    event(name: string): Events.SubscriptionBuilder;
}
export declare type Awaitable<T> = Promise<T> | T;
