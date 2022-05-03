/// <reference types="node" />
import Events from '@fuwa/events';
import { APIRequest, RequestManager, Response } from '@fuwa/rest';
import { Snowflake } from 'discord-api-types/globals';
import EventEmitter from 'events';
import { ILogger } from '../logging/ILogger.js';
import { Channels } from '../structures/Channel.js';
import { DMChannel } from '../structures/DMChannel.js';
import { ExtendedUser } from '../structures/ExtendedUser.js';
import { Guild } from '../structures/Guild.js';
import { GuildMember } from '../structures/GuildMember.js';
import { ChannelManager } from '../structures/managers/ChannelManager.js';
import { GuildManager } from '../structures/managers/GuildManager.js';
import { UserManager } from '../structures/managers/UserManager.js';
import { Message } from '../structures/Message.js';
import { GatewayManager } from '../ws/GatewayManager.js';
import { GatewayShard } from '../ws/GatewayShard.js';
import { ClientOptions } from './ClientOptions';
export declare class Client extends EventEmitter {
    #private;
    options: Required<ClientOptions>;
    logger: ILogger;
    ws: GatewayManager;
    http: RequestManager;
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
    createDM(recipient: Snowflake, cache?: boolean): Promise<DMChannel>;
}
export interface Client {
    on<K extends keyof ClientEvents>(event: K, listener: (...args: ClientEvents[K]) => void): this;
    on<K extends Exclude<string, keyof ClientEvents>>(event: K, listener: (...args: any[]) => void): this;
}
export interface ClientEvents {
    ready: [];
    shardResume: [shard: GatewayShard];
    shardReady: [shard: GatewayShard];
    shardReconnect: [shard: GatewayShard];
    shardRespawn: [id: number];
    guildCreate: [Guild];
    guildDelete: [id: Snowflake];
    guildUpdate: [old: Guild, new: Guild];
    channelCreate: [Channels];
    channelDelete: [{
        id: Snowflake;
        guild: Snowflake | null;
    }];
    channelUpdate: [old: Channels, new: Channels];
    guildMemberAdd: [GuildMember];
    guildMemberRemove: [{
        guild: Snowflake;
        id: Snowflake;
    }];
    guildMemberUpdate: [old: GuildMember, new: GuildMember];
    guildMembersChunk: [guild: Guild, members: Snowflake[]];
    messageCreate: [Message];
    messageDelete: [
        {
            guild: Snowflake | null;
            channel: Snowflake;
            id: Snowflake;
        }
    ];
    messageUpdate: [old: Message, new: Message];
}
export declare type APIRequestOptions<D = any> = Omit<APIRequest<D>, 'route'>;
export declare type APIProxy = {
    [key: string]: APIProxy;
} & {
    get: APIProxyExecuteRequest<true>;
    post: APIProxyExecuteRequest;
    put: APIProxyExecuteRequest;
    patch: APIProxyExecuteRequest;
    delete: APIProxyExecuteRequest<true>;
} & ((...args: any[]) => APIProxy);
declare type APIProxyExecuteRequest<O = false> = <T, D = any, Json = true>(options?: O extends true ? Omit<APIRequestOptions<D>, 'body' | 'files'> : APIRequestOptions<D>, json?: Json) => Promise<Json extends true ? T : Response<T>>;
export {};
