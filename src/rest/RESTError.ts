import { AxiosResponse } from 'axios';
import { APIRequest } from './Request.js';

export class RESTError extends Error {
  constructor(
    route: string,
    code: number,
    method: string,
    res: AxiosResponse,
    public data?: any
  ) {
    super();
    this.message = `${code} ${res.statusText} [${method} ${route}]`;
    this.name = 'RESTError';
  }
}

export class RateLimitedError extends RESTError {
  public _message = 'You are being rate limited.';

  constructor(req: APIRequest, res: AxiosResponse, bucket: string) {
    super(req.route, 429, req.method, res, req.data);

    this.message = `429 Too Many Requests [${req.method} ${req.route}; bucket ${bucket}] (retried ${req.retries} times)`;
    this.name = 'RateLimitedError';

    this._message = res.data.message;
  }
}
