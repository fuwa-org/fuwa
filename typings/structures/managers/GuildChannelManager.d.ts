import { Snowflake } from '../../client/ClientOptions';
import { Guild } from '../Guild';
import { GuildChannel } from '../GuildChannel';
import { ChannelManager } from './ChannelManager.js';
export declare class GuildChannelManager extends ChannelManager<GuildChannel> {
    guild: Guild;
    constructor(guild: Guild);
    fetch(id: Snowflake): Promise<GuildChannel>;
    resolve(data: any): GuildChannel | undefined;
    add(data: GuildChannel): GuildChannel;
}
