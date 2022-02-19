import axios, { AxiosRequestHeaders, AxiosResponse } from "axios";
import { ClientOptions } from "../client/ClientOptions";
import { APIRequest } from "./Request";

/**
 * Utility class for easy HTTP requests to the Discord API. Can be used for other APIs if needed.
 */
export class RESTClient {
  public baseUrl: string;
  /**
   * API version to add to the {@link RESTClient.baseUrl}. Leave empty to not add a version at all.
   */
  public version?: number;
  /**
   * An authentication token to include in the `Authorization` header for requests. Leave empty to not send that header.
   */
  public auth?: string;

  public options: RESTClientOptions;

  public static createRESTOptions(clientOptions: ClientOptions, token: string, tokenType: "Bot" | "Bearer"): RESTClientOptions {
    const options: Required<ClientOptions> = clientOptions as unknown as any;
    return {
      baseUrl: options.httpBaseUrl,
      version: options.apiVersion,
      auth: `${tokenType} ${token}`,
      userAgent: options.httpUserAgent,
      headers: {},
    }
  }

  public constructor(options: RESTClientOptions) {
    this.baseUrl = options.baseUrl;
    this.version = options.version;
    this.auth = options.auth;

    this.options = options;
  }

  public execute<T = any>(request: APIRequest): Promise<AxiosResponse<T>> {
    return axios.request<T>({
      url: this.formatRoute(request.route),
      method: request.method,
      headers: Object.assign(this.createHeaders(), request.headers),
      data: request.data,
    })
  }

  public formatRoute(route: string) {
    return this.baseUrl + (this.version ? `/v${this.version}` : "") + route
  }

  public createHeaders(): AxiosRequestHeaders {
    let headers: AxiosRequestHeaders = {};

    if (this.options.headers) Object.assign(headers, this.options.headers);
    headers["user-agent"] = headers["user-agent"] ?? this.options.userAgent ?? "Mozila/5.0 (compatible; Fuwa)";
    if (this.auth) headers.authorization = headers.authorization ?? this.auth;

    return headers;
  }
}

export interface RESTClientOptions {
  baseUrl: string,
  version?: number,
  auth?: string,
  userAgent?: string,
  /** Additional headers to send */
  headers?: AxiosRequestHeaders,
}
