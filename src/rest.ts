import fetch, { BodyInit, RequestInit, Response } from 'node-fetch';
import { Client } from './client';
import { CONSTANTS, HTTPMethod } from './constants';
import { Util } from './util/util';

export interface RequestOptions {
  headers?: Record<string, string>;
  data?: BodyInit | Record<string, unknown> | unknown;
  rawUrl?: boolean;
  method?: HTTPMethod;
}
export interface ResponseRatelimitData {
  'X-RateLimit-Limit': number;
  'X-RateLimit-Remaining': number;
  'X-RateLimit-Reset': number;
  'X-RateLimit-Reset-After': number;
  'X-RateLimit-Bucket': string;
}
export interface RESTManager {
  token: string;
}
export class RESTManager {
  client: Client;
  rateLimits: Map<string, ResponseRatelimitData> = new Map();
  constructor(client: Client) {
    this.client = client;
    Object.defineProperty(this, 'token', {
      value: client.token,
      enumerable: false,
    });
  }
  async request<T = unknown, R = T>(
    url: string,
    options: RequestOptions = {}
  ): Promise<{ data: T extends void ? R : T | Buffer; res: Response }> {
    const bucket = Util.getURLBucket(url);
    async function waitUntilRateLimitIsOver(this: RESTManager): Promise<void> {
      if (options.rawUrl) return;
      if (
        this.rateLimits.has(bucket) &&
        this.rateLimits.get(bucket)['X-RateLimit-Remaining'] < 2
      ) {
        await Util.sleep(
          this.rateLimits.get(bucket)['X-RateLimit-Reset'] - Date.now()
        );
        return waitUntilRateLimitIsOver.call(this);
      } else return;
    }
    await waitUntilRateLimitIsOver.call(this);
    const requestOptions: RequestInit = {
      body:
        typeof options.data !== 'string'
          ? JSON.stringify(options.data)
          : options.data,
      headers: {
        ...(options.headers || {}),
        ...CONSTANTS.api.headers,
        Authorization: `Bot ${this.client.token}`,
      },
      method: options.method || 'GET',
    };
    const res = await fetch(url, requestOptions);
    let data: T extends void ? R : T = (
      await res.buffer()
    ).toString() as unknown as T extends void ? R : T;
    if (res.ok) {
      try {
        data = JSON.parse(data.toString().toString());
      } catch {} // eslint-disable-line no-empty
    } else {
      if (res.status === 429) throw new Error('rate limit encountered');
    }
    this.rateLimits.set(bucket, Util.extractRatelimitHeaders(res));
    return { data: data as T extends void ? R : T, res };
  }
}
