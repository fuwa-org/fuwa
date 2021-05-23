import { Snowflake } from './snowflake';
import { Response } from 'node-fetch';
import { ResponseRatelimitData } from '../rest';
export declare class Util {
  constructor();
  /**
   * Transforms a snowflake from a bit string to a decimal string.
   * @param  num Bit string to be transformed
   */
  static binaryToID(num: string): Snowflake;
  static extractRatelimitHeaders(res: Response): ResponseRatelimitData;
  static getURLBucket(url: string): string;
  /**
   * Transforms a snowflake from a decimal string to a bit string.
   * @param  num Snowflake to be transformed
   */
  static idToBinary(num: Snowflake): string;
  static noop(): void;
  static sleep(ms: number): Promise<void>;
}
