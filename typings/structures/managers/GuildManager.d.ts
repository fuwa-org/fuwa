import { APIGuild } from '@splatterxl/discord-api-types';
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
    event(name: string): import("@fuwa/events/types/SubscriptionBuilder");
}
