import { Client } from '../../client/Client';
import { Snowflake } from '../../client/ClientOptions';
export declare class BaseManager<T extends {
    id: Snowflake;
    _deserialise(data: any): T;
}> {
    client: Client;
    __class: any;
    cache: Map<Snowflake, T>;
    constructor(client: Client, __class: any);
    get(id: T['id']): T | undefined;
    add(data: T): void;
    addMany(data: T[]): void;
    update(data: T): T;
    remove(id: Snowflake): void;
    resolve(data: Snowflake | any): void | T;
    isManager: boolean;
}
