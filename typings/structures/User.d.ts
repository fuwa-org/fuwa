import { APIUser } from "discord-api-types";
import { Client } from "../client";
import { Base } from "./Base";
import { ImageURLOptions } from "../types";
import { Snowflake } from "../util/snowflake";
import { UserFlags } from "../util/UserFlags";
export declare class User extends Base {
    bot: null | boolean;
    id: Snowflake;
    avatarHash: string;
    email: null | string;
    flags: null | UserFlags;
    locale: null | string;
    system: null | boolean;
    username: string;
    discriminator: string;
    verified: null | boolean;
    mfaEnabled: null | boolean;
    constructor(client: Client, data: APIUser & {
        id: Snowflake;
    });
    avatar(options?: ImageURLOptions): string | null;
}
