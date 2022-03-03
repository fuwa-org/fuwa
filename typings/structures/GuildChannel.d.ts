import { APIGuildChannel, ChannelType, GuildChannelType } from "@splatterxl/discord-api-types";
import { Snowflake } from "../client/ClientOptions";
import { Channel } from "./Channel";
import { Guild } from "./Guild";
export declare class GuildChannel<T extends APIGuildChannel<GuildChannelType> = APIGuildChannel<GuildChannelType>> extends Channel<T> {
    guild: Guild;
    type: GuildChannelType;
    name: string;
    position: number;
    nsfw: boolean;
    parentId: Snowflake | null;
    get parent(): GuildChannel<APIGuildChannel<GuildChannelType>> | undefined;
    constructor(guild: Guild);
    _deserialise(data: T): this;
    static create(guild: Guild, data: {
        type: ChannelType;
        [k: string]: any;
    }): GuildChannels;
    setName(name: string): void;
    setPosition(position: number): void;
    setNsfw(nsfw: boolean): void;
    setParent(parent: GuildChannels | Snowflake): void;
}
declare type GuildChannels = GuildChannel;
export {};
