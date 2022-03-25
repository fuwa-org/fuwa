import { STATUS_CODES } from 'node:http';
import { ResponseData } from 'undici/types/dispatcher';
import { Client } from '../client/Client.js';
import { APIRequest, resolveRequest } from './APIRequest.js';
import { BucketQueueManager } from './BucketQueueManager.js';
import { RESTClient } from './RESTClient';
import {
  APIError,
  parseErr,
  RateLimitedError,
  RESTError,
} from './RESTError.js';

// Yeah, copied from Discord.js because I can't even think for myself.
export class RequestManager {
  // maybe this'll be of some use someday
  // private buckets: Map<string, RateLimit> = new Map();

  /** The total amount of requests we can make until we're globally rate-limited. */
  public limit = 50;
  /** The time offset between us and Discord. */
  public offset = 0;

  /** Queue managers for different buckets */
  public buckets: Map<string, BucketQueueManager> = new Map();

  /** The remaining requests we can make until we're globally rate-limited. */
  public remaining = 50;
  /** When the global rate limit will reset. */
  public reset = Date.now() + 1e3;

  constructor(public client: RESTClient, public _client: Client) {}

  public get durUntilReset() {
    return this.reset + this.offset - Date.now();
  }

  public getBucket(route: RouteLike) {
    const majorId =
      /(?:channels|guilds|webhooks)\/(\d{17,19})/.exec(route)?.[1] ?? 'global';

    const endpoint = route
      // strip ids
      .replace(/\d{17,19}/g, ':id')
      // reactions are in the same bucket
      .replace(/\/reactions\/(.*)/, '/reactions/:reaction');

    return [`${endpoint}:${majorId}`, majorId];
  }

  public get globalLimited() {
    return this.remaining === 0 && Date.now() < this.reset;
  }

  public async makeRequest(
    bucket: BucketQueueManager,
    requestData: APIRequest
  ): Promise<ResponseData> {
    const req = resolveRequest(requestData);

    const res = await this.client.execute(req);

    if (req.useBaseUrl) this.updateOffset(res);

    this._client.debug(
      `[${this._client.logger.kleur().green('REST')} => ${this._client.logger
        .kleur()
        .green('Manager')}] ${req.method.toUpperCase()} ${req.route} -> ${
        res.statusCode
      } ${STATUS_CODES[res.statusCode]}`
    );

    if (res.statusCode < 200) {
      throw new RESTError(req, res);
    } else if (res.statusCode < 300) {
      return res;
    } else if (res.statusCode < 500) {
      switch (res.statusCode) {
        case 429: {
          if (!req.useRateLimits)
            throw new Error(
              `Ratelimited on non-bucketed request: ${req.method} ${req.route}`
            );
          if (res.headers['x-ratelimit-global']) {
            this.limit = +res.headers['x-ratelimit-global-limit']!;
            this.remaining = +res.headers['x-ratelimit-global-remaining']!;
            this.reset = +res.headers['x-ratelimit-global-reset']! * 1000;

            if (req.retries < req.allowedRetries) {
              req.retries++;
              this._client.debug('got ratelimited at', bucket.id, '- retrying');

              return this.queue(req);
            } else {
              throw new RateLimitedError(req, res, bucket.id);
            }
          } else {
            return bucket.handleRateLimit(req, res);
          }
        }
        case 401:
          throw new Error('Token has been invalidated or was never valid');
        default: {
          const text = await res.body.text();

          try {
            throw parseErr(req, res, JSON.parse(text), new Error().stack);
          } catch (err) {
            if (err instanceof APIError || err instanceof RateLimitedError)
              throw err;

            throw new RESTError(req, res, text);
          }
        }
      }
    } else {
      throw new RESTError(req, res);
    }
  }
  public queue<T>(
    req: APIRequest | RouteLike
  ): Promise<ResponseData & { body: { json(): Promise<T> } }> {
    if (typeof req === 'string') {
      req = resolveRequest({ route: req });
    } else req = resolveRequest(req);

    if (!req.useRateLimits)
      return this.makeRequest(null as unknown as BucketQueueManager, req);

    const [endpoint, majorId] = this.getBucket(req.route as RouteLike);

    if (!this.buckets.has(endpoint)) {
      this.buckets.set(
        endpoint,
        new BucketQueueManager(this, endpoint, majorId)
      );
    }

    return this.buckets.get(endpoint)!.queue(req);
  }

  private updateOffset(res: ResponseData) {
    const discordDate = new Date(res.headers['date']!).getTime();
    const local = Date.now();

    this.offset = local - discordDate;
  }
}

export type RouteLike = `/${string}`;
