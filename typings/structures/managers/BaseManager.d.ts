import { Client } from '../../client/Client';
import { Snowflake } from '../../client/ClientOptions';
export declare class BaseManager<T extends {
    id: Snowflake;
}> {
    client: Client;
    cache: Map<Snowflake, T>;
    constructor(client: Client);
    get(id: T['id']): T | undefined;
    add(data: T): void;
    update(data: T): void;
    remove(id: Snowflake): void;
}
