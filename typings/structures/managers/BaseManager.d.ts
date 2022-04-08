import { Client } from '../../client/Client';
import { Snowflake } from '../../client/ClientOptions';
export declare abstract class BaseManager<T extends {
    id: Snowflake;
    _deserialise(data: any): T;
}> {
    client: Client;
    __class: any;
    cache: Map<Snowflake, T>;
    get size(): number;
    constructor(client: Client, __class: any);
    get(id: T['id']): T | undefined;
    add(data: T): T;
    addMany(data: T[]): T[];
    removeMany(ids: Snowflake[]): void;
    update(data: T): T;
    remove(id: Snowflake): void;
    map(fn: (data: T, key: Snowflake, cache: Map<Snowflake, T>) => any): any[];
    resolve(data: Snowflake | any): T | undefined;
    abstract fetch(id: Snowflake, cache?: boolean): Promise<T>;
}
