import { APIGuild } from 'discord-api-types/v10';
import { Client } from '../../client/Client';
import { Snowflake } from '../../client/ClientOptions';
import { Guild } from '../Guild';
import { BaseManager } from './BaseManager';
export declare class GuildManager extends BaseManager<Guild> {
    constructor(client: Client);
    fetch(id: Snowflake, force?: boolean): Promise<Guild>;
    create(data?: {
        name: string;
    } & Partial<APIGuild>): Promise<Guild>;
    delete(id: Snowflake): Promise<void>;
    leave(id: Snowflake): Promise<void>;
}
