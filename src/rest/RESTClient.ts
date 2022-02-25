import { ClientOptions } from '../client/ClientOptions';
import { APIRequest } from './APIRequest';
import { RouteLike } from './RequestManager.js';
import FormData from "form-data";
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

  public createHeaders(originalHeaders = {}, auth = false): Record<string, string> {
    const headers: Record<string, string> = originalHeaders ?? {};

    if (this.options.headers) Object.assign(headers, this.options.headers);
    headers['user-agent'] =
      headers['user-agent'] ??
      this.options.userAgent ??
      'Mozila/5.0 (compatible; Fuwa)';
    if (this.#auth && auth) headers.authorization = headers.authorization ?? this.#auth;

    return headers;
  }

  public formatRoute(route: RouteLike, versioned = true): string {
    return this.baseUrl + ((this.version && versioned) ? `/v${this.version}` : '') + route;
  }

  public resolveBody(req: APIRequest): APIRequest {
    if (req.files?.length) {
      const data = new FormData();
      let i = 0;

      for (const file of req.files) {
        data.append(file.key ? typeof file.key === "number" ? `files[${file.key}]` : file.key : `files[${i++}]`, file.data, {
          contentType: file.contentType,
        });
      }

      if (req.body) {
        data.append("payload_json", req.body, { contentType: "application/json" });
      }

      req.headers = data.getHeaders(req.headers);

      req.body = data.getBuffer(); 
    } 
    else if (typeof req.body === "string") {
      req.body = Buffer.from(req.body);
    }
    else if (req.body instanceof Buffer) {
      // do nothing
    }
    else if (typeof req.body === "object" && req.body !== null) {
      req.body = Buffer.from(JSON.stringify(req.body));
    }

    if (req.body) req.headers!["content-length"] = Buffer.byteLength(req.body).toString();

    return req;
  }

  public createURL(request: APIRequest) {
    let query = "";
    if (request.query) {
      query = `?${request.query.toString()}`;
    }

    return `${this.formatRoute(request.route, request.versioned)}${query}`
  }

  public execute(request: APIRequest): Promise<ResponseData> {
    request = this.resolveBody(request);

    const options: any = {
      method: request.method,
      headers: this.createHeaders(request.headers, request.auth),
    };

    if (request.body) options.body = request.body;

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
