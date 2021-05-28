import { Client } from '../client';
export declare class Base<T = Record<string, unknown>> {
    client: Client;
    constructor(client: Client, data?: T, patch?: boolean);
    _patch(data: T): void;
}
