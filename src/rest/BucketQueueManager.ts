import { AsyncQueue } from '@sapphire/async-queue';
import { APIRequest } from './APIRequest';
import { RequestManager } from './RequestManager';
import { setTimeout as sleep } from 'node:timers/promises';
import { RateLimitedError } from './RESTError.js';
import { ResponseData } from 'undici/types/dispatcher';

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
    public readonly majorId: string,
  ) {}

  private applyRateLimitInfo(res: ResponseData) {
    if (res.headers['x-ratelimit-limit']) {
      this.limit = +res.headers['x-ratelimit-limit'];
      this.remaining = +res.headers['x-ratelimit-remaining']!;
      this.reset = +res.headers['x-ratelimit-reset']! * 1000;
    } else {
      // the route uses omly the global rate limit
    }
  }
  public get durUntilReset() {
    return this.reset + this.manager.offset - Date.now();
  }
  public handleRateLimit(req: APIRequest, res: ResponseData) {
    this.applyRateLimitInfo(res);

    if (req.retries! < req.allowedRetries!) {
      req.retries!++;

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

  public async queue(req: APIRequest): Promise<ResponseData> {
    // let running requests finish
    await this.#queue.wait();

    if (this.limited) {
      if (this.localLimited) {
        const dur = this.durUntilReset;
        this.debug(`Rate limited, sleeping for ${dur}ms`);
        await sleep(dur);
      } else if (this.manager.globalLimited) {
        const dur = this.manager.durUntilReset;
        this.debug(`Rate limited, sleeping for ${dur}ms`);
        await sleep(this.manager.durUntilReset);
      }
    }

    try {
      const res = await this.manager.makeRequest(
        this,
        req as Required<APIRequest>,
      );

      this.applyRateLimitInfo(res);

      return res;
    } finally {
      this.#queue.shift();
    }
  }

  private debug(...data: any[]) {
    this.manager._client?.debug(
      `[${this.manager._client?.logger
        .kleur()
        .blueBright('REST')} => ${this.manager._client?.logger
        .kleur()
        .green(this.id)}]`,
      ...data,
    );
  }
}
