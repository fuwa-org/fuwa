import { Client } from '../../client/Client.js';
import { Snowflake } from '../../client/ClientOptions.js';
import { ExtendedUser } from '../ExtendedUser.js';
import { User } from '../User.js';
import { BaseManager } from './BaseManager.js';
export declare class UserManager extends BaseManager<ExtendedUser | User> {
    constructor(client: Client);
    fetch(id: Snowflake, cache?: boolean): Promise<ExtendedUser | User>;
    fetchCurrent(): Promise<ExtendedUser>;
}
