import { STATUS_CODES } from 'http';
import { ResponseData } from 'undici/types/dispatcher';
import { APIRequest } from './APIRequest';

export class RESTError extends Error {
  public body: any;

  constructor(req: APIRequest, res: ResponseData, public error?: any) {
    super();
    this.message = `${res.statusCode} ${STATUS_CODES[res.statusCode]} [${req.method} ${req.route}]`;
    this.name = 'RESTError';
    this.body = req.body?.toString();
  }
}

export class RateLimitedError extends RESTError {
  public _message = 'You are being rate limited.';

  constructor(req: APIRequest, res: ResponseData, bucket: string) {
    super(req, res);

    this.message = `429 Too Many Requests [${req.method} ${req.route}; bucket ${bucket}] (retried ${req.retries} times)`;
    this.name = 'RateLimitedError';
  }
}
