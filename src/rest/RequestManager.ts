import { APIRequest } from "./Request";
import { RESTClient } from "./RESTClient";

// Yeah, copied from Discord.js because I can't even think for myself.
export class RequestManager {
  private buckets: Map<string, RateLimit> = new Map();
  private queues: Map<string, IHandler> = new Map();

  constructor(public client: RESTClient) {}

  public queue(req: APIRequest) {
    
  }

  public getBucket(route: RouteLike) {
    const majorId = /(?:channels|guilds|webhooks)\/(\d{17,19})/.exec(route)?.[1] ?? "global";

    const endpoint = route
      // strip ids 
      .replace(/\d{17,19}/g, ":id")
      // reactions are in the same bucket 
      .replace(/\/reactions\/(.*)/, "/reactions/:reaction");

    return `${endpoint}:${majorId}`;
  }
}

export type RouteLike = `/${string}`;
export interface RateLimit {
  global: boolean;
  limit: number;
  /** The UNIX timestamp this rate limit expires at. */
  reset: number;
}
