import { Client } from '../../client/Client.js';
import { Snowflake } from '../../client/ClientOptions.js';
import { ClientUser } from '../ClientUser.js';
import { User } from '../User.js';
import { BaseManager } from './BaseManager.js';
export declare class UserManager extends BaseManager<ClientUser | User> {
    constructor(client: Client);
    fetch(id: Snowflake, force?: boolean): Promise<ClientUser | User>;
    fetchCurrent(): Promise<ClientUser>;
}
