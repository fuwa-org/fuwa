import { APIGuildChannel, GuildChannelType } from '@splatterxl/discord-api-types';
import { Client } from '../client/Client.js';
import { Snowflake } from '../client/ClientOptions';
import { Channel } from './Channel';
import { Guild } from './Guild';
export declare class GuildChannel<T extends APIGuildChannel<GuildChannelType> = APIGuildChannel<GuildChannelType>> extends Channel<T> {
    name: string;
    position: number;
    nsfw: boolean;
    parentId: Snowflake | null;
    get parent(): GuildChannels | undefined;
    get children(): GuildChannels[];
    _deserialise(data: T): this;
    static resolve(client: Client, data: APIGuildChannel<GuildChannelType>, guild: Guild): GuildChannels;
    setName(name: string): void;
    setPosition(position: number): void;
    setNsfw(nsfw: boolean): void;
    setParent(parent: GuildChannels | Snowflake): void;
    toJSON(): T;
}
export declare type GuildChannels = GuildChannel | GuildTextChannel | GuildVoiceChannel;
import { GuildTextChannel } from './GuildTextChannel.js';
import { GuildVoiceChannel } from './GuildVoiceChannel.js';
