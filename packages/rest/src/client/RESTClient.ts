import FormData from 'form-data';
import { URLSearchParams } from 'node:url';
import { inspect } from 'node:util';
import undici from 'undici';
import Dispatcher from 'undici/types/dispatcher';
import { APIRequest } from './APIRequest';
import { RouteLike } from '../managers/RequestManager';
import { version } from '../util';

/**
 * Low level utility class for easy HTTP requests to the Discord API. Can be used for other APIs if needed.
 *
 * @internal You should use {@link REST} or {@link RequestManager} for Discord.
 */
export class RESTClient {
  /**
   * An authentication token to include in the `Authorization` header for requests.
   */
  #auth?: string;
  /**
   * Base URL to use for the API.
   * @default https://discord.com/v10
   */
  public baseURL?: string;
  /**
   * API version to add to the {@link RESTClient.baseURL}. Leave empty to not add a version at all.
   */
  public version?: number;
  private readonly options: RESTClientOptions;

  public constructor(options: RESTClientOptions) {
    this.baseURL = options.baseURL;
    this.version = options.version;
    this.#auth = options.auth;

    delete options.baseURL;
    delete options.version;

    this.options = options;

    Object.defineProperty(this.options, 'auth', {
      value: this.options.auth,
      enumerable: false,
    });
  }

  /**
   * Used for generating options based off of the client's options. Should not
   * be used directly.
   */
  public static createRESTOptions(
    clientOptions: RESTClientOptions,
    token: string,
    tokenType: 'Bot' | 'Bearer',
  ): RESTClientOptions {
    return {
      baseURL: clientOptions.baseURL,
      version: clientOptions.version,
      auth: `${tokenType} ${token}`.trim(),
      userAgent: clientOptions.userAgent,
      headers: {},
    };
  }
  public static getDefaultOptions(): Exclude<RESTClientOptions, 'auth'> {
    return {
      baseURL: 'https://discord.com/api',
      version: 10,
      userAgent: `DiscordBot (https://github.com/fuwa-org/fuwa; ${version})`,
      headers: {},
    };
  }

  public setAuth(auth?: string) {
    this.#auth = auth;
    return this;
  }
  public getAuth() {
    return this.#auth;
  }

  public createHeaders(request: APIRequest): Record<string, string> {
    const headers: Record<string, string> = request.headers ?? {};

    if (this.options.headers) Object.assign(headers, this.options.headers);
    headers['user-agent'] = headers['user-agent'] ?? this.options.userAgent;

    if (!headers['user-agent']) {
      process.emitWarning(
        "Missing 'user-agent' header passed to fuwa RESTClient",
      );
    }

    if (request.auth) {
      headers.authorization = request.auth;
    } else if (this.#auth && request.useAuth) {
      headers.authorization = headers.authorization ?? this.#auth;
    }

    if (request.reason && request.reason.length) {
      headers['x-audit-log-reason'] = request.reason;
    }

    if (request.locale && request.locale.length) {
      headers['x-discord-locale'] = request.locale;
      headers['accept-language'] = request.locale;
    }

    return headers;
  }

  public formatRoute(
    route: RouteLike,
    versioned = true,
    useBase = true,
  ): string {
    if (!useBase) return route;
    return (
      this.baseURL +
      (this.version && versioned ? `/v${this.version}` : '') +
      route
    );
  }

  public resolveBody(req: APIRequest): APIRequest {
    if (req.files?.length) {
      const data = new FormData();
      let i = 0;

      for (const file of req.files) {
        data.append(
          file.key
            ? typeof file.key === 'number'
              ? `files[${file.key}]`
              : file.key
            : `files[${i++}]`,
          file.data,
          {
            contentType: file.contentType,
            filename: file.filename,
          },
        );
      }

      if (req.body) {
        if (req.payloadJson)
          data.append('payload_json', JSON.stringify(req.body), {
            contentType: 'application/json',
          });
        else
          for (const key in req.body) {
            if ([null, undefined].includes(req.body[key])) continue;

            if (Array.isArray(req.body[key]))
              for (let i = 0; i < req.body[key].length; i++)
                data.append(`${key}[${i}]`, JSON.stringify(req.body[key][i]));
            else data.append(key, JSON.stringify(req.body[key]));
          }
      }

      req.headers = data.getHeaders(req.headers);

      req.body = data.getBuffer();
    } else if (typeof req.body === 'string') {
      req.body = Buffer.from(req.body);
      req.headers = {
        ...req.headers,
        'content-type': 'text/plain',
      };
    } else if (req.body instanceof Buffer) {
      req.headers = {
        ...req.headers,
        'content-type': 'application/octet-stream',
      };
    } else if (typeof req.body === 'object' && req.body !== null) {
      req.body = Buffer.from(JSON.stringify(req.body));
      req.headers = {
        ...req.headers,
        'content-type': 'application/json',
      };
    }

    if (req.body)
      req.headers!['content-length'] = Buffer.byteLength(req.body).toString();

    return req;
  }

  public createURL(request: APIRequest) {
    let query = '';
    if (request.query) {
      if (
        typeof request.query === 'object' &&
        !(request.query instanceof URLSearchParams)
      ) {
        request.query = new URLSearchParams(request.query);
      }
      query = `?${request.query.toString()}`;
    }

    return `${this.formatRoute(
      request.route as RouteLike,
      request.versioned,
      request.useBaseURL,
    )}${query}`;
  }

  public execute(
    request: APIRequest,
    tracefunc?: any,
  ): Promise<Dispatcher.ResponseData> {
    request = this.resolveBody(request);

    const options: Dispatcher.RequestOptions = {
        method: request.method ?? 'GET',
        headers: this.createHeaders(request),
      } as Dispatcher.RequestOptions,
      url = this.createURL(request);

    if (request.body) options.body = request.body;

    if (tracefunc) {
      tracefunc(
        options.method,
        url,
        options.body
          ? prettifyBody(
              options.headers![
                'content-type' as keyof (typeof options)['headers']
              ],
              options.body! as Buffer,
            )
          : '',
      );
    }

    return undici.request(url, options);
  }
}

export interface RESTClientOptions {
  baseURL?: string;
  version?: number;
  auth?: string;
  userAgent?: string;
  /** Additional headers to send */
  headers?: Record<string, string>;
}

function prettifyBody(contentType: string, body: Buffer) {
  if (contentType.startsWith('application/json')) {
    return inspect(JSON.parse(body.toString()), {
      depth: null,
      colors: false,
    });
  }

  return body?.toString();
}
