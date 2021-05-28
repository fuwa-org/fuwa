import Collection from '@discordjs/collection';
import { Snowflake } from 'discord-api-types';
import { Client } from '../client';
export declare class BaseManager<T extends {
    id: Snowflake;
} = {
    id: Snowflake;
}> {
    cache: Collection<`${bigint}`, T>;
    client: Client;
    constructor(client: Client);
    add(data: T): void;
    remove(data: T): void;
}
