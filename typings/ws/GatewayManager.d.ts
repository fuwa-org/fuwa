/// <reference types="node" />
import { APIGatewayBotInfo } from 'discord-api-types/v10';
import EventEmitter from 'node:events';
import { Client } from '../client/Client.js';
import { GatewayShard } from './GatewayShard.js';
export declare class GatewayManager extends EventEmitter {
    #private;
    client: Client;
    shards: Map<number, GatewayShard>;
    count: number;
    gateway: APIGatewayBotInfo;
    get ping(): number;
    private concurrency;
    private _lastIdentify;
    private lock;
    constructor(client: Client);
    debug(...args: any[]): void;
    error(...args: any[]): void;
    trace(...args: any[]): void;
    shard(id: number): GatewayShard | undefined;
    spawnWithShardingManager(options: GatewayManagerShardingOptions): Promise<void>;
    spawn(options: GatewayManagerOptions): Promise<void>;
    respawn(id: number): Promise<boolean>;
    recalculate(amount: number): Promise<void>;
    recalculate(info: APIGatewayBotInfo): Promise<void>;
    private _registerListeners;
    private onClose;
    private fetchGatewayBot;
    private constructGatewayURL;
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
    url?: string;
    skipExisting?: boolean;
    trimExisting?: boolean;
}
