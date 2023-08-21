import Dispatcher from 'undici/types/dispatcher';
import { APIRequest, File } from './client/APIRequest';
export declare class RESTError extends Error {
    error?: any;
    body: any;
    constructor(req: APIRequest, res: Dispatcher.ResponseData, error?: any);
}
export declare class RateLimitedError extends RESTError {
    constructor(req: APIRequest, res: Dispatcher.ResponseData, bucket?: string);
}
export declare function parseErr(req: APIRequest, res: Dispatcher.ResponseData, error?: any, stack?: string): RateLimitedError | APIError;
export declare class APIError extends RESTError {
    route: string;
    body: any;
    files?: File[];
    method: string;
    constructor(req: APIRequest, _res: Dispatcher.ResponseData, error?: any, stack?: string);
}
