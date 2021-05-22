import { Util } from "./util";
/**
 * A container for useful snowflake-related methods.
 */
export declare class SnowflakeUtil extends Util {
    /**
     * Discord's epoch value (2015-01-01T00:00:00.000Z).
     */
    static EPOCH: number;
    /**
     * Generates a Discord snowflake.
     * <info>This hardcodes the worker ID as 1 and the process ID as 0.</info>
     */
    static generate(timestamp?: number | Date): Snowflake;
    /**
     * Deconstructs a Discord snowflake.
     */
    static deconstruct(snowflake: Snowflake): DeconstructedSnowflake;
}
export interface DeconstructedSnowflake {
    timestamp: number;
    date: Date;
    workerID: number;
    processID: number;
    increment: number;
    binary: string;
}
export declare type Snowflake = `${number}`;
