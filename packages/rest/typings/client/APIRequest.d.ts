/// <reference types="node" />
/// <reference types="node" />
import { Locale } from 'discord-api-types/rest/v10';
import { URLSearchParams } from 'node:url';
import Dispatcher from 'undici/types/dispatcher';
export interface APIRequest<T = any, Q = Record<string, any>> {
    route: string;
    auth?: string | null;
    versioned?: boolean;
    query?: URLSearchParams | Q | null;
    body?: T | null;
    files?: File[] | null;
    method?: Dispatcher.HttpMethod;
    headers?: Record<string, string>;
    reason?: string | null;
    locale?: Locale | null;
    useRateLimits?: boolean;
    useGlobalRateLimit?: boolean;
    useBaseURL?: boolean;
    useAuth?: boolean;
    allowedRetries?: number;
    retries?: number;
    payloadJson?: boolean;
    startTime?: number;
    httpStartTime?: number;
}
export interface File {
    key?: string | number;
    filename?: string;
    data: Buffer;
    contentType?: string;
}
export declare function resolveRequest(req: APIRequest): Required<APIRequest>;
