import { APIUser } from '@splatterxl/discord-api-types';
import { Snowflake } from '../client/ClientOptions.js';
import { UserFlags } from '../util/bitfields/UserFlags.js';
import { BaseStructure } from './templates/BaseStructure.js';

export class User extends BaseStructure<APIUser> {
  public id!: Snowflake;
  public bot = false;
  public system = false;
  public flags: UserFlags = new UserFlags(0);

  public username!: string;
  public discriminator = '0000';
  public get tag() {
    return `${this.username}#${this.discriminator}`;
  }

  public avatar: string | null = null;
  public banner: string | null = null;

  _deserialise(data: APIUser): this {
    this.id = data.id as Snowflake;
    if ('bot' in data) this.bot = data.bot!;
    if ('system' in data) this.system = data.system!;
    if ('public_flags' in data) this.flags = new UserFlags(data.public_flags!);

    if ('username' in data) this.username = data.username;
    if ('discriminator' in data) this.discriminator = data.discriminator;
    if ('avatar' in data) this.avatar = data.avatar;
    if ('banner' in data) this.banner = data.banner!;

    return this;
  }
}
