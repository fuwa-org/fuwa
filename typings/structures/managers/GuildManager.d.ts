import { Snowflake } from '../../client/ClientOptions';
import { Guild } from '../Guild';
import { BaseManager } from './BaseManager';
export declare class GuildManager extends BaseManager<Guild> {
    fetch(id: Snowflake, force?: boolean): Promise<Guild>;
}
