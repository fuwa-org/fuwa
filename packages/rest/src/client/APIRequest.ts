import { Locale } from 'discord-api-types/rest/v10';
import { URLSearchParams } from 'node:url';
import Dispatcher from 'undici/types/dispatcher';

export interface APIRequest<T = any, Q = Record<string, any>> {
  /**
   * The endpoint to be used for this request.
   */
  route: string;
  /**
   * Manually override the authentication header.
   *
   * @example using OAuth2
   * await client.getCurrentUser({
   *   auth: 'Bearer my-bearer-token',
   *   useRateLimits: false
   * });
   */
  auth?: string | null;
  /**
   * Whether to include a version in the API URL, e.g. `/v10/users/@me`
   */
  versioned?: boolean;
  /**
   * Search parameters to include in the API URL.
   */
  query?: URLSearchParams | Q | null;
  /**
   * The HTTP request body to use for this request. Can be any valid serialisable JSON body, **excluding {@link BigInt}**s.
   */
  body?: T | null;
  /**
   * Files to include in the request. Will be indexed by `file[n]` or {@link File.key} in the form body.
   */
  files?: File[] | null;
  /**
   * HTTP Method to use in the request.
   */
  method?: Dispatcher.HttpMethod;
  /**
   * Additional headers that will be added to the request, e.g. X-Super-Properties, etc.
   */
  headers?: Record<string, string>;
  /**
   * Will be added as `X-Audit-Log-Reason` in headers.
   */
  reason?: string | null;
  /**
   * Will be added as `X-Discord-Locale` in headers.
   */
  locale?: Locale | null;

  /**
   * Use rate limits under the bot's namespace. Automatically disabled for requests with {@link APIRequest.useAuth} set to false.
   */
  useRateLimits?: boolean;
  /**
   * Respect the bot's global rate limits. Automatically disabled for requests with {@link APIRequest.useAuth} set to false.
   */
  useGlobalRateLimit?: boolean;
  /**
   * Indicates whether the request is to Discord, and whether the date offset for rate limits should be updated.
   */
  useBaseURL?: boolean;
  /**
   * Whether to send the `Authorization` header (including bot token) for this request.
   */
  useAuth?: boolean;

  /**
   * If an error/rate limit is encountered, how many retries are allowed.
   */
  allowedRetries?: number;
  /**
   * @internal
   * The amount of times this request has been already tried.
   */
  retries?: number;

  /**
   * Add the JSON body to `payload_json` in the final request.
   */
  payloadJson?: boolean;

  // timings
  /**
   * @internal
   */
  startTime?: number;
  /**
   * @internal
   */
  httpStartTime?: number;
}

export interface File {
  /**
   * The key to index this by in the final {@link FormData} object.
   * @default "file[n]"
   */
  key?: string | number;
  /**
   * Filename to report to Discord.
   */
  filename?: string;
  data: Buffer;
  /**
   * Must be a valid media type.
   * @example
   * "image/png"
   */
  contentType?: string;
}

/**
 * @private
 * @internal
 * @param req Base request
 */
export function resolveRequest(req: APIRequest): Required<APIRequest> {
  return {
    useAuth: true,
    versioned: true,
    query: null,
    files: null,
    body: null,
    method: 'GET',
    allowedRetries: 5,
    retries: 0,
    headers: {},
    reason: null,
    locale: null,
    useRateLimits: true,
    useGlobalRateLimit: req.useAuth !== false,
    useBaseURL: true,
    payloadJson: false,
    startTime: -1,
    httpStartTime: -1,
    auth: null,
    ...req,
  };
}
