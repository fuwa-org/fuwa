import { APIGuildMember } from '@splatterxl/discord-api-types';
import { Guild } from './Guild.js';
import { BaseStructure } from './templates/BaseStructure.js';
import { User } from './User.js';

export class GuildMember extends BaseStructure<APIGuildMember> {
  public guild!: Guild;
  public user: User | null = null;
  public nickname: string | null = null;

  constructor(guild: Guild) {
    super(guild.client);

    this.guild = guild;
  }

  public _deserialise(_data: APIGuildMember): this {
    this.inheritFrom(_data, ['nickname']);

    return this;
  }

  public _patch(data: APIGuildMember, guild?: Guild, user?: User): this {
    this._deserialise(data);

    this.user =
      user ??
      (data.user ? this.client.users.resolve(data.user!) : null) ??
      this.user;
    this.guild = guild ?? this.guild;

    return this;
  }
}
