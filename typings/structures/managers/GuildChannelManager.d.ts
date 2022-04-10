import { GuildChannelType, RESTPostAPIGuildChannelJSONBody } from 'discord-api-types/v10';
import { Snowflake } from '../../client/ClientOptions';
import { CreateEntityOptions } from '../../util/util';
import { Guild } from '../Guild';
import { GuildChannels } from '../GuildChannel';
import { ChannelManager } from './ChannelManager.js';
export declare class GuildChannelManager extends ChannelManager<GuildChannels> {
    guild: Guild;
    constructor(guild: Guild);
    resolve(data: any): GuildChannels | undefined;
    add(data: GuildChannels): GuildChannels;
    fetch(id: Snowflake, cache?: boolean): Promise<GuildChannels>;
    delete(id: Snowflake, reason?: string): Promise<void>;
    create(options: CreateGuildChannelOptions): Promise<GuildChannels>;
    create(name: string, type: GuildChannelType): Promise<GuildChannels>;
}
export interface CreateGuildChannelOptions extends CreateEntityOptions, Omit<RESTPostAPIGuildChannelJSONBody, 'type'> {
    type: GuildChannelType;
}
