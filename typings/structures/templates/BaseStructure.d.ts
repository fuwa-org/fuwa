import { Client } from '../../client/Client';
export declare abstract class BaseStructure<T> {
    client: Client;
    constructor(client: Client);
    abstract _deserialise(_data: T): void;
    inheritFrom<S>(source: S, props: ((keyof S & keyof this) | [sourceKey: keyof this, targetKey: keyof this])[]): this;
}
