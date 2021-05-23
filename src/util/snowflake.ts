"use strict";

import { Util } from "./util";

let INCREMENT = 0;

/**
 * A container for useful snowflake-related methods.
 */
export class SnowflakeUtil extends Util {
  /**
   * Discord's epoch value (2015-01-01T00:00:00.000Z).
   */
  static EPOCH = 1420070400000;
  /**
   * Deconstructs a Discord snowflake.
   */
static deconstruct(snowflake: Snowflake): DeconstructedSnowflake {
    const BINARY = Util.idToBinary(snowflake).padStart(64, "0");
    return {
      timestamp: parseInt(BINARY.substring(0, 42), 2) + this.EPOCH,
      get date() {
        return new Date(this.timestamp);
      },
      workerID: parseInt(BINARY.substring(42, 47), 2),
      processID: parseInt(BINARY.substring(47, 52), 2),
      increment: parseInt(BINARY.substring(52, 64), 2),
      binary: BINARY,
    };
  }
/**
   * Generates a Discord snowflake.
   * <info>This hardcodes the worker ID as 1 and the process ID as 0.</info>
   */
  static generate(timestamp: number | Date = Date.now()): Snowflake {
    if (timestamp instanceof Date) timestamp = timestamp.getTime();
    if (typeof timestamp !== "number" || isNaN(timestamp)) {
      throw new TypeError(
        `"timestamp" argument must be a number (received ${
          isNaN(timestamp) ? "NaN" : typeof timestamp
        })`
      );
    }
    if (INCREMENT >= 4095) INCREMENT = 0;
    const BINARY = `${(timestamp - this.EPOCH)
      .toString(2)
      .padStart(42, "0")}0000100000${(INCREMENT++)
      .toString(2)
      .padStart(12, "0")}`;
    return Util.binaryToID(BINARY);
  }

  
  
}
export interface DeconstructedSnowflake {
  timestamp: number;
  date: Date;
  workerID: number;
  processID: number;
  increment: number;
  binary: string;
}
export type Snowflake = `${number}`;
