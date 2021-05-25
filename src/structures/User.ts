import { APIUser } from 'discord-api-types';
import { Client } from '../client';
import { CONSTANTS } from '../constants';
import { ImageURLOptions, UserPremiumType } from '../types';
import { Snowflake, SnowflakeUtil } from '../util/snowflake';
import { UserFlags } from '../util/UserFlags';
import { Base } from './Base';
/** A Bot or User on Discord. */
export class User extends Base {
  /** The user's avatar hash. Set to `null` if the user has a default avatar. */
  avatarHash: null | string = null;
  /** Whether the user is a bot account. */
  bot = false;
  /** The {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date|`Date`} at which the user was created. */
  createdAt: Date;
  /** The UNIX timestamp at which the user was created */
  createdTimestamp: number;
  /** The user's discriminator (e.g.: Discord#**0000**) */
  discriminator: string;
  /** The user's email address. Only available in Oauth2 connections. */
  email: null | string = null;
  /** The user's [public flags](https://discord.com/developers/docs/resources/user#user-object-user-flags) */
  flags = new UserFlags(0);
  /** The user's ID */
  id: Snowflake;
  /** The user's preferred client locale. Only available in Oauth2 connections. */
  locale: null | string = null;
  /** Whether the user (or bot's owner) has 2 factor authentication enabled. */
  mfaEnabled: null | boolean = null;
  /** The user's [Discord Nitro](https://dis.gd/nitro) subscription type.
   * @see UserPremiumType
   */
  premiumType: null | UserPremiumType = null;
  /** Whether the user is part of the urgent message system */
  system: null | boolean = null;
  /** The user's username */
  username: string;
  /** Whether the user has verified their email address */
  verified: null | boolean = null;

  constructor(client: Client, data: APIUser & { id: Snowflake }) {
    super(client);
    this._patch(data);
    this.createdAt = SnowflakeUtil.deconstruct(this.id).date;
    this.createdTimestamp = this.createdAt.getTime();
  }
  _patch(data: APIUser & { id: Snowflake }): this {
    if ('bot' in data) this.bot = data.bot;
    if ('avatar' in data) this.avatarHash = data.avatar;
    if ('id' in data) this.id = data.id;
    if ('email' in data) this.email = data.email;
    if ('flags' in data) this.flags = new UserFlags(data.flags);
    else if ('public_flags' in data)
      this.flags = new UserFlags(data.public_flags);
    if ('locale' in data) this.locale = data.locale || null;
    if ('system' in data) this.system = data.system || null;
    if ('username' in data) this.username = data.username;
    if ('discriminator' in data) this.discriminator = data.discriminator;
    if ('verified' in data) this.verified = data.verified || null;
    if ('mfa_enabled' in data) this.mfaEnabled = data.mfa_enabled;
    if ('premium_type' in data) this.premiumType = data.premium_type;
    return this;
  }
  /** Get the avatar URL of the user */
  avatar(
    options: ImageURLOptions = { size: 512, format: 'webp', dynamic: false }
  ): string | null {
    if (this.avatarHash)
      return CONSTANTS.urls.cdn.avatar(
        this.avatarHash,
        options.dynamic && this.avatarHash.startsWith('a_')
          ? 'gif'
          : options.format,
        options.size
      );
    else return CONSTANTS.urls.cdn.defaultAvatar(+this.discriminator);
  }
}
