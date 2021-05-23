import { APIUser } from 'discord-api-types';
import { Client } from '../client';
import { Base } from './Base';
import { ImageURLOptions, UserPremiumType } from '../types';
import { Snowflake } from '../util/snowflake';
import { UserFlags } from '../util/UserFlags';
export declare class User extends Base {
  avatarHash: string;
  bot: boolean;
  discriminator: string;
  email: null | string;
  flags: UserFlags;
  id: Snowflake;

  locale: null | string;
  mfaEnabled: null | boolean;
  premiumType: null | UserPremiumType;
  system: null | boolean;
  username: string;

  verified: null | boolean;

  constructor(
    client: Client,
    data: APIUser & {
      id: Snowflake;
    }
  );
  _patch(
    data: APIUser & {
      id: Snowflake;
    }
  ): this;
  avatar(options?: ImageURLOptions): string | null;
}
