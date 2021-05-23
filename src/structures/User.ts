import { APIUser } from 'discord-api-types';
import { Client } from '../client';
import { Base } from './Base';
import { ImageURLOptions, UserPremiumType } from '../types';
import { Snowflake } from '../util/snowflake';
import { CONSTANTS } from '../constants';
import { UserFlags } from '../util/UserFlags';

export class User extends Base {
  avatarHash: string;
  bot = false;
  discriminator: string;
  email: null | string = null;
  flags: UserFlags = new UserFlags(0);
  id: Snowflake;

  locale: null | string = null;
  mfaEnabled: null | boolean = null;
  premiumType: null | UserPremiumType = null;
  system: null | boolean = null;
  username: string;

  verified: null | boolean = null;

  constructor(client: Client, data: APIUser & { id: Snowflake }) {
    super(client);
    this._patch(data);
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
