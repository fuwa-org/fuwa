import { RESTPostAPIGuildsJSONBody, Snowflake } from 'discord-api-types/v10';
import { Client } from '../../client/Client';
import { CreateEntityOptions } from '../../util/util';
import { Guild } from '../Guild';
import { BaseManager } from './BaseManager';
export declare class GuildManager extends BaseManager<Guild> {
    constructor(client: Client);
    fetch(id: Snowflake, cache?: boolean): Promise<Guild>;
    create(name: string, { cache, ...options }?: CreateGuildOptions): Promise<Guild>;
    delete(id: Snowflake): Promise<void>;
    leave(id: Snowflake): Promise<void>;
}
export declare type CreateGuildOptions = CreateEntityOptions & Omit<RESTPostAPIGuildsJSONBody, 'name'>;
