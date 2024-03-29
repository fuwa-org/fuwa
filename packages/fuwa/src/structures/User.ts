import { APIUser, Snowflake } from 'discord-api-types/v10';
import { UserFlags } from '../util/bitfields/UserFlags.js';
import { MessagePayload } from '../util/resolvables/MessagePayload.js';
import { DMChannel } from './DMChannel.js';
import { BaseStructure } from './templates/BaseStructure.js';

export class User extends BaseStructure<APIUser> {
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

  public dm: DMChannel | null = null;

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

  public toString(): string {
    return `<@${this.id}>`;
  }

  public fetch(): Promise<this> {
    return this.client.users.fetch(this.id) as Promise<this>;
  }

  public async createDM(cache = false) {
    return (this.dm ??= await this.client.channels.createDM(this.id, cache));
  }

  public async send(content: MessagePayload | string) {
    await this.createDM();
    return this.dm!.createMessage(content);
  }

  toJSON(): APIUser {
    return {
      id: this.id,
      bot: this.bot,
      system: this.system,
      public_flags: this.flags.bits,
      username: this.username,
      discriminator: this.discriminator,
      avatar: this.avatar,
      banner: this.banner,
    };
  }
}
