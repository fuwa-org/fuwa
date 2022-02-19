import { Client } from "../client/Client";
import { GatewaySendPayload } from "@splatterxl/discord-api-types";
/** A shard connection the Discord gateway. */
export declare class GatewayShard {
    #private;
    client: Client;
    readonly shard: [number, number];
    id: number;
    compress: boolean;
    erlpack: boolean;
    session?: string;
    private s;
    private _socket?;
    constructor(client: Client, shard: [number, number], token: string);
    connect(url: string): Promise<void>;
    private onMessage;
    private debug;
    private authenticate;
    /**
     * Send a packet to the {@link Client._socket|socket}. Use at your own risk.
     * @internal
     */
    send(packet: GatewaySendPayload): Promise<void>;
}
