import FormData from 'form-data';
import undici from 'undici';
import { ResponseData } from 'undici/types/dispatcher';
import { APIRequest } from './APIRequest';
import { RouteLike } from './RequestManager.js';

/**
 * Utility class for easy HTTP requests to the Discord API. Can be used for other APIs if needed.
 */
export class RESTClient {
  /**
   * An authentication token to include in the `Authorization` header for requests. Leave empty to not send that header.
   */
  #auth?: string;
  public baseURL: string;
  public options: RESTClientOptions;
  /**
   * API version to add to the {@link RESTClient.baseURL}. Leave empty to not add a version at all.
   */
  public version?: number;

  public constructor(options: RESTClientOptions) {
    this.baseURL = options.baseURL;
    this.version = options.version;
    this.#auth = options.auth;

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
    clientOptions: any,
    token: string,
    tokenType: 'Bot' | 'Bearer',
  ): RESTClientOptions {
    return {
      baseURL: clientOptions.httpBaseURL,
      version: clientOptions.apiVersion,
      auth: `${tokenType} ${token}`,
      userAgent: clientOptions.httpUserAgent,
      headers: {},
    };
  }
  public static getDefaultOptions(token: string): Required<RESTClientOptions> {
    return {
      baseURL: 'https://discord.com/api',
      version: 10,
      auth: `Bot ${token}`,
      userAgent: `DiscordBot (https://github.com/fuwa-org/fuwa; 0.0.0)`,
      headers: {},
    };
  }

  public setAuth(auth: string) {
    this.#auth = auth;
    return this;
  }

  public createHeaders(request: APIRequest): Record<string, string> {
    const headers: Record<string, string> = request.headers ?? {};

    if (this.options.headers) Object.assign(headers, this.options.headers);
    headers['user-agent'] =
      headers['user-agent'] ??
      this.options.userAgent ??
      'Mozila/5.0 (compatible; Fuwa)';
    if (this.#auth && request.auth)
      headers.authorization = headers.authorization ?? this.#auth;
    if (request.reason && request.reason.length)
      headers['x-audit-log-reason'] = request.reason;

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
      query = `?${request.query.toString()}`;
    }

    return `${this.formatRoute(
      request.route as RouteLike,
      request.versioned,
      request.useBaseURL,
    )}${query}`;
  }

  public execute(request: APIRequest, tracefunc?: any): Promise<ResponseData> {
    request = this.resolveBody(request);

    const options: any = {
        method: request.method,
        headers: this.createHeaders(request),
      },
      url = this.createURL(request);

    if (request.body) options.body = request.body;

    if (tracefunc) {
      tracefunc(
        options.method,
        url,
        '\n',
        'body:',
        prettifyBody(options.headers['content-type'] ?? '', options.body),
      );
    }

    return undici.request(url, options);
  }
}

export interface RESTClientOptions {
  baseURL: string;
  version?: number;
  auth?: string;
  userAgent?: string;
  /** Additional headers to send */
  headers?: Record<string, string>;
}

function prettifyBody(contentType: string, body: Buffer) {
  if (contentType.startsWith('application/json')) {
    return JSON.parse(body.toString());
  }

  return body?.toString();
}