import { APIUser } from "discord-api-types";
import { Client } from "../client";
import { Base } from "./Base";
export declare class User extends Base {
    bot?: boolean;
    avatarHash: string;
    constructor(client: Client, data: APIUser);
    avatar(options: any): void;
}
