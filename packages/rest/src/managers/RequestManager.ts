import { STATUS_CODES } from 'node:http';
import Dispatcher from 'undici/types/dispatcher';
import { APIRequest, resolveRequest } from '../client/APIRequest';
import { BucketQueueManager } from './BucketQueueManager';
import { RESTClient, TypedResponseData } from '../client/RESTClient';
import { APIError, RESTError, RateLimitedError, parseErr } from '../error';

export interface RequestManagerOptions {
  timings?: boolean;
  logger?: {
    debug?: (...args: any[]) => void;
    trace?: (...args: any[]) => void;
    kleur?: any;
    header?: (() => string) | string;
  };
}

/**
 * This class manages rate limits for the client.
 * @internal Use {@link REST} as this class is still quite low-level.
 */
export class RequestManager {
  // maybe this will be of some use someday
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

  constructor(
    public client: RESTClient,
    public init: RequestManagerOptions = {},
  ) {}

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

  public get limited() {
    return this.remaining === 0 && Date.now() < this.reset;
  }

  public async makeRequest<T>(
    bucket: BucketQueueManager,
    req: Required<APIRequest>,
  ): Promise<TypedResponseData<T>> {
    if (this.init.timings) req.httpStartTime = Date.now();

    this.trace(`Sending ${req.method} to ${req.route}...`);

    const res: Dispatcher.ResponseData & {
        body: { json(): Promise<T> };
      } = await this.client.execute<T>(
        req,
        this.init.logger?.trace && !this.init.logger?.debug
          ? this.trace.bind(this)
          : undefined,
      ),
      now = Date.now();

    if (req.useBaseURL) this.updateOffset(res);

    this.debug(
      `${req.method.toUpperCase()} ${req.route} -> ${res.statusCode} ${
        STATUS_CODES[res.statusCode]
      }${
        this.init.timings
          ? ` (${now - req.startTime}ms${
              now - req.httpStartTime !== now - req.startTime
                ? ` full; ${now - req.httpStartTime}ms http`
                : ''
            })`
          : ''
      }`,
    );

    if (res.statusCode < 200) {
      throw new RESTError(req, res);
    } else if (res.statusCode < 300) {
      if (req.useRateLimits) {
        this.updateHeaders(res);
      }

      return res;
    } else if (res.statusCode < 500) {
      switch (res.statusCode) {
        case 429: {
          if (!req.useRateLimits)
            throw new Error(
              `Ratelimited on non-bucketed request: ${req.method} ${req.route}`,
            );
          if (res.headers['x-ratelimit-global']) {
            this.limit = +res.headers['x-ratelimit-global-limit']!;
            this.remaining = +res.headers['x-ratelimit-global-remaining']!;
            this.reset = +res.headers['x-ratelimit-global-reset']! * 1000;

            if (req.retries < req.allowedRetries) {
              req.retries++;
              this.debug('got rate-limited at', bucket.id, '- retrying');

              return this.queue(req);
            } else {
              throw new RateLimitedError(req, res, bucket.id);
            }
          } else {
            return bucket.handleRateLimit(req, res);
          }
        }
        case 401:
          if (this.client.getAuth())
            throw new Error('Token has been invalidated or was never valid');
        // eslint-disable-next-line no-fallthrough
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

  public queue<T = unknown, B = any>(
    route: RouteLike,

    options?: Omit<APIRequest<B>, 'route'>,
  ): Promise<Response<T>>;
  public queue<T = unknown, B = any>(req: APIRequest<B>): Promise<Response<T>>;
  public queue<T = unknown, B = any>(
    req: APIRequest<B> | RouteLike,

    options?: APIRequest<B>,
  ): Promise<Dispatcher.ResponseData & { body: { json(): Promise<T> } }> {
    if (typeof req === 'string') {
      req = resolveRequest({ route: req, ...options });
    } else req = resolveRequest(req);

    if (this.init.timings) req.startTime = Date.now();

    if (!req.useRateLimits)
      return this.makeRequest(
        null as unknown as BucketQueueManager,
        req as Required<APIRequest>,
      );

    const [endpoint, majorId] = this.getBucket(req.route as RouteLike);

    if (!this.buckets.has(endpoint)) {
      this.buckets.set(
        endpoint,
        new BucketQueueManager(this, endpoint, majorId),
      );
    }

    return this.buckets.get(endpoint)!.queue(req);
  }

  private updateOffset(res: Dispatcher.ResponseData) {
    const discordDate = new Date(res.headers['date']!.toString()).getTime();
    const local = Date.now();

    this.offset = local - discordDate;
  }

  // this doesn't need to run in the same tick as the request
  private updateHeaders(res: Dispatcher.ResponseData) {
    this.remaining--;

    while (Date.now() > this.reset) {
      this.reset += 1e3;
      this.remaining = this.limit;
    }

    if (
      !!res.headers['x-ratelimit-bucket'] ||
      !res.headers['x-ratelimit-reset']
    )
      return;

    this.limit = +res.headers['x-ratelimit-limit']!;
    this.remaining = +res.headers['x-ratelimit-remaining']!;
    this.reset = +res.headers['x-ratelimit-reset']! * 1000;
  }

  /** @ignore */
  __log_header() {
    if (this.init.logger?.header) {
      const header = this.init.logger.header;

      if (typeof header === 'function') {
        return header();
      } else {
        return header;
      }
    } else {
      return `[${this.init.logger?.kleur?.().green('REST') ?? 'REST'}]`;
    }
  }

  debug(...args: any[]) {
    this.init.logger?.debug?.(this.__log_header(), ...args);
  }

  private trace(...args: any[]) {
    this.init.logger?.trace?.(this.__log_header(), ...args);
  }
}

export type RouteLike = `/${string}`;
export type Response<T> = Dispatcher.ResponseData & {
  body: { json(): Promise<T> };
};
export function consumeJSON<D = any>(res: TypedResponseData<D>): Promise<D> {
  if (res.headers['content-type']!.includes('application/json')) {
    return res.body.json() as Promise<D>;
  } else {
    throw new Error('API response was not JSON');
  }
}
