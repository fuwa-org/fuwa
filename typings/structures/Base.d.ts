import { Client } from "../client/Client";
export declare abstract class Base<T> {
    client: Client;
    constructor(client: Client, data: T);
    abstract _deserialise(_data: T): void;
    from<S>(source: S, props: ((keyof S & keyof this) | [sourceKey: keyof this, targetKey: keyof this] | {
        [key: keyof S]: keyof this | ((data: any) => [key: string, value: any]);
    })[]): this;
}
