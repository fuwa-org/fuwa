import { AxiosResponse } from 'axios';
import { APIRequest } from './Request.js';
export declare class RESTError extends Error {
    data?: any;
    constructor(route: string, code: number, method: string, res: AxiosResponse, data?: any);
}
export declare class RateLimitedError extends RESTError {
    _message: string;
    constructor(req: APIRequest, res: AxiosResponse, bucket: string);
}
