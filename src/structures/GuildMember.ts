import { APIGuildMember, Routes } from '@splatterxl/discord-api-types';
import { Snowflake } from '../client/ClientOptions.js';
import { DataTransformer } from '../rest/DataTransformer.js';
import { Guild } from './Guild.js';
import { BaseStructure } from './templates/BaseStructure.js';
import { User } from './User.js';

export class GuildMember extends BaseStructure<APIGuildMember> {
  /**
   * @deprecated use {@link GuildMember.user|`<member>.user.id`} instead
   */
  public declare id: Snowflake;
  /**
   * @deprecated use {@link GuildMember.joinedAt} instead
   */
  public get createdAt(): Date {
    return this.joinedAt;
  }
  /**
   * @deprecated use {@link GuildMember.joinedTimestamp} instead
   */
  public get createdTimestamp(): number {
    return this.joinedTimestamp;
  }

  public guild!: Guild;
  public user: User | null = null;
  public nickname: string | null = null;
  public avatar: string | null = null;

  public pending = false;
  public communicationDisabledUntil: Date | null = null;
  public get communicationDisabledUntilTimestamp() {
    return this.communicationDisabledUntil?.getTime() ?? null;
  }

  public joinedAt!: Date;
  public get joinedTimestamp() {
    return this.joinedAt.getTime();
  }

  public premiumSince: Date | null = null;
  public get premiumSinceTimestamp() {
    return this.premiumSince?.getTime() ?? null;
  }
  public get isPremiumSupporter(): boolean {
    return this.premiumSince !== null;
  }

  public deaf = false;
  public mute = false;

  constructor(guild: Guild) {
    super(guild.client);

    this.guild = guild;
  }

  public _deserialise(data: APIGuildMember & { joined_at: string | null }): this {
    if ('user' in data) this.user = this.client.users.resolve(data.user!)!;
    if ('nick' in data) this.nickname = data.nick!;
    if ('avatar' in data) this.avatar = data.avatar!;
    if ('pending' in data) this.pending = data.pending!;
    if ('communication_disabled_until' in data)
      this.communicationDisabledUntil = data.communication_disabled_until
        ? new Date(data.communication_disabled_until)
        : null;
    if ('joined_at' in data) this.joinedAt = new Date(data.joined_at);
    if ('premium_since' in data)
      this.premiumSince = data.premium_since
        ? new Date(data.premium_since)
        : null;
    if ('deaf' in data) this.deaf = data.deaf!;
    if ('mute' in data) this.mute = data.mute!;

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

  public async edit(
    data: Partial<APIGuildMember | GuildMember>,    
    reason?: string
  ): Promise<GuildMember> {
    const res = await this.client.http
      .queue({
        route: Routes.guildMember(this.guild.id, this.user!.id),
        method: 'PATCH',
        body: DataTransformer.asJSON(data),
        reason,
      })
      .then(async (data) => await data.body.json());

    return this.guild.members.resolve(
      this._deserialise(res as APIGuildMember)
    )!;
  }

  public disableCommunication(
    until: Date | number,
    reason?: string
  ): Promise<GuildMember> {
    return this.edit(
      {
        communication_disabled_until: (until instanceof Date
          ? until.getTime() / 1000
          : until / 1000
        ).toString(),
      },
      reason
    );
  }

  public async ban(deleteMessageDays?: number, reason?: string) {
    await this.client.http.queue({
      route: Routes.guildBan(this.guild.id, this.user!.id),
      method: 'PUT',
      body: {
        delete_message_days: deleteMessageDays,
      },
      reason,
    });
  }

  public async unban(reason?: string) {
    await this.client.http.queue({
      route: Routes.guildBan(this.guild.id, this.user!.id),
      method: 'DELETE',
      reason,
    });
  }

  public async kick(reason?: string) {
    await this.client.http.queue({
      route: Routes.guildMember(this.guild.id, this.user!.id),
      method: 'DELETE',
      reason,
    });
  }

  public async setNickname(nickname: string, reason?: string) {
    await this.edit({ nick: nickname }, reason);
  }

  public async setDeaf(deaf: boolean, reason?: string) {
    await this.edit({ deaf }, reason);
  }

  public async setMute(mute: boolean, reason?: string) {
    await this.edit({ mute }, reason);
  }
}
