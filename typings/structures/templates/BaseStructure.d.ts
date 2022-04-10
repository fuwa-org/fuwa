import { Client } from '../../client/Client';
import { Snowflake } from '../../client/ClientOptions.js';
export declare abstract class BaseStructure<T> {
    client: Client;
    id: Snowflake;
    get createdTimestamp(): number;
    get createdAt(): Date;
    constructor(client: Client, data?: T);
    abstract _deserialise(_data: T): void;
    abstract toJSON(): T;
    static toJSON(data: any): any;
}
