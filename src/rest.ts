import { Client } from "./client";
import fetch, { RequestInit, BodyInit, Response } from "node-fetch";
import { Util } from "./util";
import { CONSTANTS } from "./constants";

export interface RequestOptions {
  headers?: Record<string, string>;
  data?: BodyInit;
  rawUrl?: boolean;
}
export interface RESTManager {
  token: string;
}
export class RESTManager {
  client: Client;
  constructor(client: Client) {
    this.client = client;
    Object.defineProperty(this, "token", {
      value: client.token,
      enumerable: false,
    });
  }
  async request<T = any>(
    url: string,
    options?: RequestOptions
  ): Promise<{ data: T; res: Response }> {
    const bucket = Util.getURLBucket(url);
    async function waitUntilRateLimitIsOver(): Promise<void> {
      // @ts-ignore
      if (bucket in this.rateLimits) {
        // @ts-ignore
        await Util.sleep(this.rateLimits[bucket] - Date.now());
        return waitUntilRateLimitIsOver();
      } else return;
    }
    await waitUntilRateLimitIsOver.call(this);
    const requestOptions: RequestInit = {
      body: options.data,
      headers: {
        ...options.headers,
        ...CONSTANTS.api.headers,
        Authorization: this.token,
      },
    };
    const res = await fetch(
      options.rawUrl ? url : CONSTANTS.urls.base + url,
      requestOptions
    );
    let data = await res.buffer();
    if (res.ok) {
      try {
        data = JSON.parse(data.toString()) as any;
      } catch {}
    } else {
      if (res.status === 429) throw new Error("rate limit encountered");
    }
    return { data: data as any, res };
  }
  rateLimits: Record<string, number>;
}
