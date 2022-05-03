import { APIChannel, APIChannelBase, ChannelType, Snowflake } from 'discord-api-types/v10';
import { Client } from '../client/Client.js';
import { Guild } from './Guild';
import { GuildTextChannel } from './GuildTextChannel.js';
import { GuildVoiceChannel } from './GuildVoiceChannel.js';
import { BaseStructure } from './templates/BaseStructure';
import { TextChannel } from './templates/BaseTextChannel.js';
export declare class Channel<T extends APIChannel = APIChannel> extends BaseStructure<T> {
    type: ChannelType;
    guildId: Snowflake | null;
    get guild(): Guild | null;
    _deserialise(data: T & {
        guild_id?: Snowflake;
    }): this;
    _set_guild(id: Snowflake): this;
    static create(client: Client, data: APIChannelBase<ChannelType> & {
        guild_id?: Snowflake;
    }): Channels;
    edit(data: any): Promise<this>;
    fetch(): Promise<this>;
    toJSON(): T;
    isDM(): this is DMChannel;
    isGuild(): this is GuildChannels;
    isText(): this is GuildTextChannel;
    isVoice(): this is GuildVoiceChannel;
    isCategory(): this is GuildChannel;
    isTextBased(): this is TextChannel;
    isVoiceBased(): this is GuildVoiceChannel;
}
export declare type Channels<T = GuildChannels | Channel | DMChannel, D = APIChannel> = T & {
    id: Snowflake;
    _deserialise(data: D): T;
};
import { GuildChannel, type GuildChannels } from './GuildChannel.js';
import { DMChannel } from './DMChannel.js';
