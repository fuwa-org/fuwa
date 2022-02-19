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
    this.message = `Error ${code} (${res.statusText} occurred while ${method} ${route}.`;
    this.name = 'RESTError';
  }
}

export class RateLimitedError extends RESTError {
  public _message = 'You are being rate limited.';

  constructor(req: APIRequest, res: AxiosResponse, bucket: string) {
    super(req.route, 429, req.method, res, req.data);

    this.message = `Rate limit encountered while ${req.method} ${req.route} (bucket ${bucket}). Retried ${req.retries} times.`;
    this.name = 'RateLimitedError';

    this._message = res.data.message;
  }
}
