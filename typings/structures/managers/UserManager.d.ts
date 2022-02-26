import { APIUser } from '@splatterxl/discord-api-types';
import { Snowflake } from '../../client/ClientOptions.js';
import { ClientUser } from '../ClientUser.js';
import { User } from '../User.js';
import { BaseManager } from './BaseManager.js';
export declare class UserManager extends BaseManager<ClientUser | User> {
    fetch(id: Snowflake, force?: boolean): Promise<ClientUser | User>;
    fetchCurrent(): Promise<ClientUser>;
    resolve(data: APIUser): ClientUser | User;
}
