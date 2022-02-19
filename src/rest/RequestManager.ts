import { AxiosResponse } from 'axios';
import { BucketQueueManager } from './BucketQueueManager.js';
import { APIRequest } from './Request';
import { RESTClient } from './RESTClient';
import { RateLimitedError, RESTError } from './RESTError.js';

// Yeah, copied from Discord.js because I can't even think for myself.
export class RequestManager {
  // maybe this'll be of some use someday
  /** The total amount of requests we can make until we're globally rate-limited. */
  public limit = Infinity;
  /** The time offset between us and Discord. */
  public offset = 0;
  // private buckets: Map<string, RateLimit> = new Map();
  private queues: Map<string, BucketQueueManager> = new Map();

  /** The remaining requests we can make until we're globally rate-limited. */
  public remaining = 1;
  /** When the global rate limit will reset. */
  public reset = -1;

  constructor(public client: RESTClient) {}

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
    req: APIRequest
  ): Promise<AxiosResponse> {
    const res = await this.client.execute(req);

    this.updateOffset(res);

    if (res.status < 200) {
      throw new RESTError(req.route, res.status, req.method, res, req.data);
    } else if (res.status < 300) {
      return res;
    } else if (res.status < 500) {
      switch (res.status) {
        case 429: {
          if (res.headers['x-ratelimit-global']) {
            this.limit = +res.headers['x-ratelimit-global-limit'];
            this.remaining = +res.headers['x-ratelimit-global-remaining'];
            this.reset = +res.headers['x-ratelimit-global-reset'] * 1000;

            if (req.retries < req.allowedRetries) {
              req.retries++;

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
        case 403: {
          const error = new RESTError(
            req.route,
            res.status,
            req.method,
            res,
            req.data
          );
          error.message = 'Unauthorized to execute this action.';
          throw error;
        }
        default:
          throw new RESTError(req.route, res.status, req.method, res, req.data);
      }
    } else {
      throw new RESTError(req.route, res.status, req.method, res, req.data);
    }
  }
  public queue(req: APIRequest): Promise<AxiosResponse> {
    const [endpoint, majorId] = this.getBucket(req.route);

    if (!this.queues.has(endpoint)) {
      this.queues.set(
        endpoint,
        new BucketQueueManager(this, endpoint, majorId)
      );
    }

    return this.queues.get(endpoint)!.queue(req);
  }

  private updateOffset(res: AxiosResponse) {
    const discordDate = new Date(res.headers['date']).getTime();
    const local = Date.now();

    this.offset = local - discordDate;
  }
}

export type RouteLike = `/${string}`;
export interface RateLimit {
  global: boolean;
  limit: number;
  /** The UNIX timestamp this rate limit expires at. */
  reset: number;
}
