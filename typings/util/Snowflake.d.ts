export declare class SnowflakeInfo {
    id: BigInt;
    timestamp: number;
    worker: number;
    process: number;
    increment: number;
    epoch: number;
    constructor(id: Snowflake);
    toString(): string;
}
export declare type Snowflake = string;
export declare const EPOCH = 1420070400000n;
