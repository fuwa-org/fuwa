/// <reference types="node" />
import { HttpMethod } from 'undici/types/dispatcher';
import { URLSearchParams } from 'url';
import { RouteLike } from './RequestManager';
export interface APIRequest {
    route: RouteLike;
    auth?: boolean;
    versioned?: boolean;
    query?: URLSearchParams | string | null;
    body?: any | null;
    files?: File[] | null;
    method?: HttpMethod;
    headers?: Record<string, string>;
    reason?: string | null;
    allowedRetries?: number;
    retries?: number;
}
export interface File {
    key?: string;
    filename?: string;
    data: Buffer;
    contentType?: string;
}
export declare function resolveRequest(req: APIRequest): Required<APIRequest>;
