import { APIUser } from 'discord-api-types';
import { Client } from '../client';
import { Base } from './Base';
import { ImageURLOptions, UserPremiumType } from '../types';
import { Snowflake } from '../util/snowflake';
import { UserFlags } from '../util/UserFlags';
/** A Bot or User on Discord. */
export declare class User extends Base {
    /** The user's avatar hash. Set to `null` if the user has a default avatar. */
    avatarHash: null | string;
    /** Whether the user is a bot account. */
    bot: boolean;
    /** The user's discriminator (e.g.: Discord#**0000**) */
    discriminator: string;
    /** The user's email address. Only available in Oauth2 connections. */
    email: null | string;
    /** The user's [public flags](https://discord.com/developers/docs/resources/user#user-object-user-flags) */
    flags: UserFlags;
    /** The user's ID */
    id: Snowflake;
    /** The user's preferred client locale. Only available in Oauth2 connections. */
    locale: null | string;
    /** Whether the user (or bot's owner) has 2 factor authentication enabled. */
    mfaEnabled: null | boolean;
    /** The user's [Discord Nitro](https://dis.gd/nitro) subscription type.
     * @see UserPremiumType
     */
    premiumType: null | UserPremiumType;
    /** Whether the user is part of the urgent message system */
    system: null | boolean;
    /** The user's username */
    username: string;
    /** Whether the user has verified their email address */
    verified: null | boolean;
    constructor(client: Client, data: APIUser & {
        id: Snowflake;
    });
    _patch(data: APIUser & {
        id: Snowflake;
    }): this;
    /** Get the avatar URL of the user */
    avatar(options?: ImageURLOptions): string | null;
}
