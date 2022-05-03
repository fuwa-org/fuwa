/// <reference types="node" />
import { URLSearchParams } from 'node:url';
import { HttpMethod } from 'undici/types/dispatcher';
export interface APIRequest<T = any> {
    route: string;
    auth?: boolean;
    versioned?: boolean;
    query?: URLSearchParams | string | null;
    body?: T | null;
    files?: File[] | null;
    method?: HttpMethod;
    headers?: Record<string, string>;
    reason?: string | null;
    useRateLimits?: boolean;
    useBaseURL?: boolean;
    allowedRetries?: number;
    retries?: number;
    payloadJson?: boolean;
    startTime?: number;
    httpStartTime?: number;
}
export interface File {
    key?: string;
    filename?: string;
    data: Buffer;
    contentType?: string;
}
export declare function resolveRequest(req: APIRequest): Required<APIRequest>;
