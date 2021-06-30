/// <reference types="node" />
import { Snowflake } from 'discord-api-types';
import { ImageFormat, ImageSize } from './types';
export declare const CONSTANTS: {
    urls: {
        base: string;
        getGatewayBot: string;
        socketUrl: string;
        cdn: {
            base: string;
            avatar(hash: string, format: ImageFormat, size: ImageSize): string;
            defaultAvatar(disc: number): string;
        };
        message(channelid: Snowflake, id: Snowflake): string;
        channelMessages(channelid: Snowflake): string;
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
            readonly 'User-Agent': string;
        };
    };
    getUrl(str: string): string;
};
export declare const ERRORS: {
    NO_TOKEN: TypeError;
    NO_INTENTS: TypeError;
    SHARDING: TypeError;
    IDENTIFY_LIMIT: RangeError;
};
export declare type HTTPMethod = 'GET' | 'HEAD' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'CONNECT' | 'OPTIONS' | 'TRACE' | 'get' | 'head' | 'post' | 'put' | 'patch' | 'delete' | 'connect' | 'options' | 'trace';
export declare const COLORS: {
    readonly DEFAULT: 0;
    readonly WHITE: 16777215;
    readonly AQUA: 1752220;
    readonly GREEN: 5763719;
    readonly BLUE: 3447003;
    readonly YELLOW: 16705372;
    readonly PURPLE: 10181046;
    readonly LUMINOUS_VIVID_PINK: 15277667;
    readonly FUCHSIA: 15418782;
    readonly GOLD: 15844367;
    readonly ORANGE: 15105570;
    readonly RED: 15548997;
    readonly GREY: 9807270;
    readonly NAVY: 3426654;
    readonly DARK_AQUA: 1146986;
    readonly DARK_GREEN: 2067276;
    readonly DARK_BLUE: 2123412;
    readonly DARK_PURPLE: 7419530;
    readonly DARK_VIVID_PINK: 11342935;
    readonly DARK_GOLD: 12745742;
    readonly DARK_ORANGE: 11027200;
    readonly DARK_RED: 10038562;
    readonly DARK_GREY: 9936031;
    readonly DARKER_GREY: 8359053;
    readonly LIGHT_GREY: 12370112;
    readonly DARK_NAVY: 2899536;
    readonly BLURPLE: 5793266;
    readonly GREYPLE: 10070709;
    readonly DARK_BUT_NOT_BLACK: 2895667;
    readonly NOT_QUITE_BLACK: 2303786;
};
