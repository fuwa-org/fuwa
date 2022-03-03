import { APITextBasedChannel, GuildTextChannelType } from "@splatterxl/discord-api-types";
import { Snowflake } from "../client/ClientOptions";
import { GuildChannel } from "./GuildChannel";
export declare class BaseGuildTextChannel extends GuildChannel<APITextBasedChannel<GuildTextChannelType>> {
    lastMessageId: Snowflake | null;
    _deserialise(data: APITextBasedChannel<GuildTextChannelType>): this;
}
