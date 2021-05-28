import { Snowflake } from './snowflake';
import { Response } from 'node-fetch';
import { ResponseRatelimitData } from '../rest';

export class Util {
  constructor() {
    throw new TypeError(
      `The ${this.constructor.name} class may not be instantiated.`
    );
  }
  /**
   * Transforms a snowflake from a bit string to a decimal string.
   * @param  num Bit string to be transformed
   */
  static binaryToID(num: string): Snowflake {
    let dec = '';
    let number: number = (num as unknown) as number;
    while (num.length > 50) {
      const high = parseInt(num.slice(0, -32), 2);
      const low = parseInt((high % 10).toString(2) + num.slice(-32), 2);

      dec = (low % 10).toString() + dec;
      num =
        Math.floor(high / 10).toString(2) +
        Math.floor(low / 10)
          .toString(2)
          .padStart(32, '0');
    }

    number = parseInt(num, 2);
    while (number > 0) {
      dec = (number % 10).toString() + dec;
      number = Math.floor(number / 10);
    }

    return dec as Snowflake;
  }
  static extractRatelimitHeaders(res: Response): ResponseRatelimitData {
    const obj: ResponseRatelimitData = {} as ResponseRatelimitData;
    obj['X-RateLimit-Limit'] = +res.headers.get('X-RateLimit-Limit');
    obj['X-RateLimit-Reset'] = +res.headers.get('X-RateLimit-Reset');
    obj['X-RateLimit-Bucket'] = res.headers.get('X-RateLimit-Bucket');
    obj['X-RateLimit-Remaining'] = +res.headers.get('X-RateLimit-Remaining');
    obj['X-RateLimit-Reset-After'] = +res.headers.get('X-RateLimit-Bucket');
    return obj;
  }
  // eslint-disable-line @typescript-eslint/no-empty-function
  static getURLBucket(url: string): string {
    return url.replace(/\/\d+\//g, ':id'); // t
  }
  /**
   * Transforms a snowflake from a decimal string to a bit string.
   * @param  num Snowflake to be transformed
   */
  static idToBinary(num: Snowflake): string {
    let bin = '';
    let high = parseInt(num.slice(0, -10)) || 0;
    let low = parseInt(num.slice(-10));
    while (low > 0 || high > 0) {
      bin = String(low & 1) + bin;
      low = Math.floor(low / 2);
      if (high > 0) {
        low += 5000000000 * (high % 2);
        high = Math.floor(high / 2);
      }
    }
    return bin;
  }
  static noop(): void {} // eslint-disable-line @typescript-eslint/no-empty-function
  static sleep(ms: number): Promise<void> {
    return new Promise((r) => setTimeout(r, ms));
  }
}
