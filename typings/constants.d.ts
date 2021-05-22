/// <reference types="node" />
import { ImageFormat, ImageSize } from "./types";
export declare const CONSTANTS: {
    urls: {
        base: string;
        getGatewayBot: string;
        socketUrl: string;
        cdn: {
            base: string;
            avatar(hash: string, format: ImageFormat, size: ImageSize): string;
        };
    };
    api: {
        version: string;
        userAgent: string;
        gatewayProperties: {
            $os: NodeJS.Platform;
            $browser: string;
            $device: string;
        };
        headers: {
            readonly "User-Agent": string;
        };
    };
    getUrl(str: string): string;
};
export declare const ERRORS: {
    NO_TOKEN: TypeError;
    NO_INTENTS: TypeError;
    SHARDING: TypeError;
};
export declare type HTTPMethod = "GET" | "HEAD" | "POST" | "PUT" | "PATCH" | "DELETE" | "CONNECT" | "OPTIONS" | "TRACE" | "get" | "head" | "post" | "put" | "patch" | "delete" | "connect" | "options" | "trace";
