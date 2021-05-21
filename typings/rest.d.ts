/// <reference types="node" />
import { Client } from "./client";
import { BodyInit, Response } from "node-fetch";
import { HTTPMethod } from "./constants";
export interface RequestOptions {
    headers?: Record<string, string>;
    data?: BodyInit;
    rawUrl?: boolean;
    method?: HTTPMethod;
}
export interface ResponseRatelimitData {
    "X-RateLimit-Limit": number;
    "X-RateLimit-Remaining": number;
    "X-RateLimit-Reset": number;
    "X-RateLimit-Reset-After": number;
    "X-RateLimit-Bucket": string;
}
export interface RESTManager {
    token: string;
}
export declare class RESTManager {
    client: Client;
    rateLimits: Map<string, ResponseRatelimitData>;
    constructor(client: Client);
    request<T = unknown, R = T>(url: string, options?: RequestOptions): Promise<{
        data: T extends void ? R : T | Buffer;
        res: Response;
    }>;
}
