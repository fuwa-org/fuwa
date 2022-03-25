import { ResponseData } from 'undici/types/dispatcher';
import { APIRequest, File } from './APIRequest';
export declare class RESTError extends Error {
    error?: any;
    body: any;
    constructor(req: APIRequest, res: ResponseData, error?: any);
}
export declare class RateLimitedError extends RESTError {
    _message: string;
    constructor(req: APIRequest, res: ResponseData, bucket?: string);
}
export declare function parseErr(req: APIRequest, res: ResponseData, error?: any, stack?: string): RateLimitedError | APIError;
export declare class APIError extends Error {
    route: string;
    body: any;
    files?: File[];
    constructor(req: APIRequest, _res: ResponseData, error?: any, stack?: string);
}
