import { APITextBasedChannel, GuildTextChannelType } from "@splatterxl/discord-api-types";
import { Snowflake } from "../../client/ClientOptions";
import { GuildChannel } from "../GuildChannel";
import { ChannelMessageManager } from "../managers/ChannelMessageManager";
export declare class BaseTextChannel extends GuildChannel<APITextBasedChannel<GuildTextChannelType>> {
    lastMessageId: Snowflake | null;
    messages: ChannelMessageManager;
    _deserialise(data: APITextBasedChannel<GuildTextChannelType>): this;
}
