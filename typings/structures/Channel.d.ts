import { APIChannel, APIChannelBase, ChannelType } from 'discord-api-types/v10';
import { Client } from '../client/Client.js';
import { Snowflake } from '../client/ClientOptions';
import type { DMChannel } from './DMChannel.js';
import { Guild } from './Guild';
import { GuildChannels } from './GuildChannel.js';
import { BaseStructure } from './templates/BaseStructure';
export declare class Channel<T extends APIChannel = APIChannel> extends BaseStructure<T> {
    type: ChannelType;
    guildId: Snowflake | null;
    get guild(): Guild | null;
    _deserialise(data: T & {
        guild_id?: Snowflake;
    }): this;
    static create(client: Client, data: APIChannelBase<ChannelType> & {
        guild_id?: Snowflake;
    }): Channels;
    edit(data: any): Promise<this>;
    delete(): Promise<import("undici/types/dispatcher").ResponseData & {
        body: {
            json(): Promise<unknown>;
        };
    }>;
    fetch(): Promise<this>;
    toJSON(): T;
}
export declare type Channels<T = GuildChannels | Channel | DMChannel, D = APIChannel> = T & {
    id: Snowflake;
    _deserialise(data: D): T;
};
