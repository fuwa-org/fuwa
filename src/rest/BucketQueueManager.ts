import { AsyncQueue } from '@sapphire/async-queue';
import { APIRequest } from './Request';
import { RequestManager } from './RequestManager';
import { setTimeout as sleep } from 'node:timers/promises';
import { AxiosResponse } from 'axios';
import { RateLimitedError } from './RESTError.js';

export class BucketQueueManager {
  #queue = new AsyncQueue();
  /** The total amount of requests that can be made on this bucket before getting rate limited. */
  public limit = Infinity;
  /** The remaining requests we can make until we are rate limited. */
  public remaining = 1;
  /** The UNIX timestamp at which this bucket's rate limit will expire. */
  public reset = -1;

  constructor(
    private readonly manager: RequestManager,
    public readonly id: string,
    public readonly majorId: string
  ) {}

  private applyRateLimitInfo(res: AxiosResponse) {
    if (res.headers['x-ratelimit-limit']) {
      this.limit = +res.headers['x-ratelimit-limit'];
      this.remaining = +res.headers['x-ratelimit-remaining'];
      this.reset = +res.headers['x-ratelimit-reset'] * 1000;
    } else {
      throw new Error("Couldn't find rate limit headers.");
    }
  }
  public get durUntilReset() {
    return this.reset + this.manager.offset - Date.now();
  }
  public handleRateLimit(req: APIRequest, res: AxiosResponse) {
    this.applyRateLimitInfo(res);

    if (req.retries < req.allowedRetries) {
      req.retries++;

      return this.queue(req);
    } else {
      throw new RateLimitedError(req, res, this.id);
    }
  }
  public get limited() {
    return this.manager.globalLimited || this.localLimited;
  }
  public get localLimited() {
    return this.remaining === 0 && Date.now() < this.reset;
  }

  public async queue(req: APIRequest): Promise<AxiosResponse> {
    // let running requests finish
    await this.#queue.wait();

    if (this.limited) {
      if (this.localLimited) {
        const dur = this.durUntilReset;
        console.debug('[fuwa] Rate limited, sleeping for ' + dur + 'ms');
        await sleep(dur);
      } else if (this.manager.globalLimited) {
        const dur = this.manager.durUntilReset;
        console.debug('[fuwa] Rate limited, sleeping for ' + dur + 'ms');
        await sleep(this.manager.durUntilReset);
      }
    }

    try {
      const res = await this.manager.makeRequest(this, req);

      this.applyRateLimitInfo(res);

      return res;
    } finally {
      this.#queue.shift();
    }
  }
}