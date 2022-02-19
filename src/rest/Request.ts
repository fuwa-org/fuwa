import { AxiosRequestHeaders, AxiosResponse } from 'axios';
import { RequestManager, RouteLike } from './RequestManager.js';

export class APIRequest {
  public allowedRetries = 5;
  public data?: any;
  public headers: AxiosRequestHeaders = {};
  public method: HTTPMethod;
  public retries = 0;
  public route: RouteLike;

  constructor(route: RouteLike, method = 'GET', allowedRetries = 5) {
    this.route = route;
    this.method = APIRequest.ensureMethod(method);
    this.allowedRetries = allowedRetries;
  }
  static ensureMethod(str: string): HTTPMethod {
    switch (str.toUpperCase()) {
      case 'GET':
        return str.toLowerCase() as HTTPMethod;
      default:
        throw new TypeError(`${str} is an unsupported HTTP method.`);
    }
  }
  static get(route: RouteLike): APIRequest {
    return new APIRequest(route, 'GET');
  }
  public send(manager: RequestManager): Promise<AxiosResponse> {
    return manager.queue(this);
  }
}

type HTTPMethod = 'get';
