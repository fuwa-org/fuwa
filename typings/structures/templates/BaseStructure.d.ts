import { Client } from '../../client/Client';
import { Snowflake } from '../../client/ClientOptions.js';
export declare abstract class BaseStructure<T> {
    client: Client;
    id: Snowflake;
    get createdAt(): Date;
    get createdTimestamp(): number;
    constructor(client: Client, data?: T);
    abstract _deserialise(_data: T): void;
    abstract toJSON(): T;
    static toJSON(data: any): any;
}
