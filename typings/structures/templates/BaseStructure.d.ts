import { Client } from '../../client/Client';
import { Snowflake } from '../../client/ClientOptions.js';
export declare abstract class BaseStructure<T> {
    id: Snowflake;
    get createdAt(): Date;
    get createdTimestamp(): number;
    client: Client;
    constructor(client: Client, data?: T);
    abstract _deserialise(_data: T): void;
    inheritFrom<S>(source: S, props: ((keyof S & keyof this) | [sourceKey: keyof this, targetKey: keyof this])[]): this;
    toJSON(): T;
    static toJSON(data: any): any;
    isStructure: boolean;
}
