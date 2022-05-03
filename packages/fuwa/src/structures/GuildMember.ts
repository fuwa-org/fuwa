import { APIGuildMember, Routes, Snowflake } from 'discord-api-types/v10';
import { Client } from '../client/Client.js';
import { Guild } from './Guild.js';
import { BanGuildMemberOptions } from './managers/GuildMemberManager.js';
import { BaseStructure } from './templates/BaseStructure.js';
import { User } from './User.js';
import { GuildMemberFlags } from '../util/bitfields/GuildMemberFlags.js';

export class GuildMember extends BaseStructure<APIGuildMember> {
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

  public get guild() {
    return this.client.guilds.get(this.guildId)!;
  }
  public userId: Snowflake | null = null;
  public get user(): User | null {
    return this.client.users.resolve(this.userId) ?? null;
  }
  public nickname: string | null = null;
  public avatar: string | null = null;
  public flags = new GuildMemberFlags(0);

  public pending = false;
  public communicationDisabledUntil: Date | null = null;
  public get communicationDisabledUntilTimestamp(): number | null {
    return this.communicationDisabledUntil?.getTime() ?? null;
  }
  public isCommunicationDisabled(): boolean {
    return this.communicationDisabledUntil !== null;
  }

  public joinedAt!: Date;
  public get joinedTimestamp() {
    return this.joinedAt.getTime();
  }

  public premiumSince: Date | null = null;
  public get premiumSinceTimestamp(): number | null {
    return this.premiumSince?.getTime() ?? null;
  }
  public isPremiumSupporter(): boolean {
    return this.premiumSince !== null;
  }

  public deaf = false;
  public mute = false;

  constructor(client: Client, public guildId: Snowflake) {
    super(client);
  }

  public _deserialise(
    data: APIGuildMember & { joined_at?: string | null },
  ): this {
    if ('user' in data) {
      this.userId = data.user!.id as Snowflake;
      this.id = this.userId;
    }
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
    // this is undocumented, but used in the client for the new member badge
    if ('flags' in data)
      this.flags = new GuildMemberFlags((data as any).flags as number);

    return this;
  }

  public _patch(data: APIGuildMember, guild?: Guild, user?: User): this {
    this._deserialise(data);

    this.userId = (user?.id ??
      (data.user ? data.user.id : null) ??
      this.userId) as Snowflake;
    this.guildId = guild?.id ?? this.guildId;

    return this;
  }

  public fetch() {
    return this.guild.members.fetch(this.userId!);
  }

  public async edit(
    data: Partial<APIGuildMember>,
    reason?: string,
  ): Promise<GuildMember> {
    const res = await this.client
      .rest(Routes.guildMember(this.guild.id, this.user!.id))
      .patch({
        body: data,
        reason,
      });

    return this.guild.members.resolve(
      this._deserialise(res as APIGuildMember),
    )!;
  }

  public disableCommunication(
    until: Date | number,
    reason?: string,
  ): Promise<GuildMember> {
    return this.edit(
      {
        communication_disabled_until: (until instanceof Date
          ? until.getTime() / 1000
          : until / 1000
        ).toString(),
      },
      reason,
    );
  }

  public ban(options: BanGuildMemberOptions = {}) {
    return this.guild.members.ban(this.userId!, options);
  }

  public async unban(reason?: string) {
    return this.guild.members.unban(this.userId!, reason);
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

  toJSON(): APIGuildMember {
    return {
      user: this.user?.toJSON(),
      nick: this.nickname,
      avatar: this.avatar,
      joined_at: this.joinedAt.toISOString(),
      premium_since: this.premiumSince?.toISOString() ?? null,
      deaf: this.deaf,
      mute: this.mute,
      roles: [], // TODO
    };
  }
}

// @ts-ignore
export interface GuildMember {
  // @ts-ignore
  id: Snowflake;
}
