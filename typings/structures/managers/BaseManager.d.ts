/// <reference types="node" />
import { SubscriptionBuilder } from '@fuwa/events';
import { EventEmitter } from 'stream';
import { Client } from '../../client/Client';
import { Snowflake } from '../../client/ClientOptions';
export declare class BaseManager<T extends {
    id: Snowflake;
    _deserialise(data: any): T;
}> extends EventEmitter {
    client: Client;
    __class: any;
    cache: Map<Snowflake, T>;
    get size(): number;
    constructor(client: Client, __class: any);
    get(id: T['id']): T | undefined;
    add(data: T): T;
    addMany(data: T[]): T[];
    update(data: T): T;
    remove(id: Snowflake): void;
    map(fn: (data: T, key: Snowflake, cache: Map<Snowflake, T>) => any): any[];
    resolve(data: Snowflake | any): T | undefined;
    event(name: string): SubscriptionBuilder;
    isManager: boolean;
}
