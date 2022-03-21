import { Snowflake } from '../../client/ClientOptions';
import { Guild } from '../Guild';
import { GuildChannels } from '../GuildChannel';
import { ChannelManager } from './ChannelManager.js';
export declare class GuildChannelManager extends ChannelManager<GuildChannels> {
    guild: Guild;
    constructor(guild: Guild);
    fetch(id: Snowflake): Promise<GuildChannels>;
    resolve(data: any): GuildChannels | undefined;
    add(data: GuildChannels): GuildChannels;
}
