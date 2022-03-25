import { ClientOptions } from '../client/ClientOptions';
import { APIRequest } from './APIRequest';
import { RouteLike } from './RequestManager.js';
import FormData from 'form-data';
import undici from 'undici';
import { ResponseData } from 'undici/types/dispatcher';

/**
 * Utility class for easy HTTP requests to the Discord API. Can be used for other APIs if needed.
 */
export class RESTClient {
  /**
   * An authentication token to include in the `Authorization` header for requests. Leave empty to not send that header.
   */
  #auth?: string;
  public baseUrl: string;
  public options: RESTClientOptions;
  /**
   * API version to add to the {@link RESTClient.baseUrl}. Leave empty to not add a version at all.
   */
  public version?: number;

  public constructor(options: RESTClientOptions) {
    this.baseUrl = options.baseUrl;
    this.version = options.version;
    this.#auth = options.auth;

    this.options = options;

    Object.defineProperty(this.options, 'auth', {
      value: this.options.auth,
      enumerable: false,
    });
  }
  public static createRESTOptions(
    clientOptions: ClientOptions,
    token: string,
    tokenType: 'Bot' | 'Bearer'
  ): RESTClientOptions {
    const options: Required<ClientOptions> = clientOptions as unknown as any;
    return {
      baseUrl: options.httpBaseUrl,
      version: options.apiVersion,
      auth: `${tokenType} ${token}`,
      userAgent: options.httpUserAgent,
      headers: {},
    };
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
    useBase = true
  ): string {
    if (!useBase) return route;
    return (
      this.baseUrl +
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
          }
        );
      }

      if (req.body) {
        data.append('payload_json', JSON.stringify(req.body), {
          contentType: 'application/json',
        });
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
      request.useBaseUrl
    )}${query}`;
  }

  public execute(request: APIRequest): Promise<ResponseData> {
    request = this.resolveBody(request);

    const options: any = {
      method: request.method,
      headers: this.createHeaders(request),
    };

    if (request.body) options.body = request.body;

    console.log(options, options.body?.toString());

    return undici.request(this.createURL(request), options);
  }
}

export interface RESTClientOptions {
  baseUrl: string;
  version?: number;
  auth?: string;
  userAgent?: string;
  /** Additional headers to send */
  headers?: Record<string, string>;
}
