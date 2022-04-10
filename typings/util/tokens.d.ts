import { Client } from '../client/Client';
import { Snowflake } from '../client/ClientOptions';
export declare function validate(token: string): {
    header: string;
    payload: string;
    signature: string;
};
export declare function parse(token: string, client?: Client): TokenInfo;
export declare function redactToken(token: string): string;
export declare class TokenInfo {
    client?: Client;
    user: Snowflake;
    timestamp: Date;
    constructor(original: string, deconstructed: {
        user: Snowflake;
        timestamp: Date;
    }, client?: Client);
    fetchUser(): Promise<import("..").ExtendedUser | import("..").User>;
}
