import { Client } from '../client/Client';
import { GatewaySendPayload } from '@splatterxl/discord-api-types';
export declare class GatewayShard {
    #private;
    client: Client;
    readonly shard: [number, number];
    private _socket?;
    compress: boolean;
    erlpack: boolean;
    id: number;
    private s;
    session?: string;
    constructor(client: Client, shard: [number, number], token: string);
    private authenticate;
    connect(url: string): Promise<void>;
    private debug;
    private onMessage;
    send(packet: GatewaySendPayload): Promise<void>;
}
