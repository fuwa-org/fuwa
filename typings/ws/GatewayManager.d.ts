import { Client } from '../client/Client.js';
import { GatewayShard } from './GatewayShard.js';
export declare class GatewayManager {
    #private;
    private client;
    shards: Map<number, GatewayShard>;
    constructor(client: Client);
    private debug;
    private error;
    spawnWithShardingManager(options: GatewayManagerShardingOptions): Promise<void>;
    spawn(options: GatewayManagerOptions): Promise<void>;
    private _registerListeners;
    private fetchGatewayBot;
    reset(): void;
}
export interface GatewayManagerShardingOptions extends Omit<GatewayManagerOptions, 'shards' | 'id' | 'count'> {
    mode: 'env' | 'worker';
    workerData?: GatewayManagerShardingWorkerData;
}
export interface GatewayManagerShardingWorkerData {
    count: number;
    range?: [number, number];
    id?: number;
    increment?: number;
    limitPerWorker?: number;
}
export interface GatewayManagerOptions {
    shards: 'auto' | 1 | [number, number];
    id?: number;
    count?: number;
    url: string;
    token: string;
}
