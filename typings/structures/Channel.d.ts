import { APIChannel, ChannelType } from "@splatterxl/discord-api-types";
import { Snowflake } from "../client/ClientOptions";
import { Guild } from "./Guild";
import { BaseStructure } from "./templates/BaseStructure";
export declare class Channel<T extends APIChannel = APIChannel> extends BaseStructure<T> {
    id: Snowflake;
    type: ChannelType;
    guild: Guild | null;
    _deserialise(data: T & {
        guild_id: Snowflake;
    }): this;
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
