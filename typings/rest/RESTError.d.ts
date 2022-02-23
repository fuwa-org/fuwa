import { ResponseData } from 'undici/types/dispatcher';
import { APIRequest } from './APIRequest';
export declare class RESTError extends Error {
    error?: any;
    body: any;
    constructor(req: APIRequest, res: ResponseData, error?: any);
}
export declare class RateLimitedError extends RESTError {
    _message: string;
    constructor(req: APIRequest, res: ResponseData, bucket: string);
}
