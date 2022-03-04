import { APIChannel, APIChannelBase, ChannelType } from '@splatterxl/discord-api-types';
import { Client } from '../client/Client.js';
import { Snowflake } from '../client/ClientOptions';
import { Guild } from './Guild';
import { GuildChannel } from './GuildChannel.js';
import { BaseStructure } from './templates/BaseStructure';
export declare class Channel<T extends APIChannel = APIChannel> extends BaseStructure<T> {
    type: ChannelType;
    guild: Guild | null;
    _deserialise(data: T & {
        guild_id?: Snowflake;
    }): this;
    static create(client: Client, data: APIChannelBase<ChannelType> & {
        guild_id?: Snowflake;
    }): Channels;
    edit(data: any): Promise<import("undici/types/dispatcher").ResponseData & {
        body: {
            json(): Promise<unknown>;
        };
    }>;
    delete(): Promise<import("undici/types/dispatcher").ResponseData & {
        body: {
            json(): Promise<unknown>;
        };
    }>;
}
export declare type Channels<T = Channel | GuildChannel, D = APIChannel> = T & {
    id: Snowflake;
    _deserialise(data: D): T;
};
