import { Snowflake } from "../../client/ClientOptions";
import { Guild } from "../Guild";
import { GuildChannel } from "../GuildChannel";
import { BaseManager } from "./BaseManager";
export declare class GuildChannelManager extends BaseManager<GuildChannel> {
    guild: Guild;
    constructor(guild: Guild);
    fetch(id: Snowflake): Promise<GuildChannel>;
    resolve(data: any): GuildChannel | void;
}
