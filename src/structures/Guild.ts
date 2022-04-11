import {
  APIGuild,
  APIGuildChannel,
  APIUnavailableGuild,
  GuildChannelType,
  GuildDefaultMessageNotifications,
  GuildExplicitContentFilter,
  GuildFeature,
  GuildMFALevel,
  GuildNSFWLevel,
  GuildPremiumTier,
  GuildVerificationLevel,
  Routes,
} from 'discord-api-types/v10';
import { Snowflake } from '../client/ClientOptions';
import { DataTransformer } from '../rest/DataTransformer.js';
import { GuildSystemChannelFlags } from '../util/bitfields/GuildSystemChannelFlags';
import {
  FileResolvable,
  resolveFile,
  toDataURI,
} from '../util/resolvables/FileResolvable.js';
import { GuildChannel } from './GuildChannel';
import { GuildMember } from './GuildMember.js';
import { GuildChannelManager } from './managers/GuildChannelManager';
import { GuildMemberManager } from './managers/GuildMemberManager';
import { BaseStructure } from './templates/BaseStructure';
import { CreateEntityOptions } from '../util/util';
import { Client } from '../client/Client';
export class Guild extends BaseStructure<APIGuild | APIUnavailableGuild> {
  public available = false;

  public name: string | null = null;
  public description: string | null = null;
  public ownerId!: Snowflake;
  public get owner() {
    return this.client.users.cache.get(this.ownerId);
  }
  public applicationId: Snowflake | null = null;

  public preferredLocale = 'en_US';

  public features: GuildFeature[] = [];

  public mfaLevel: GuildMFALevel = GuildMFALevel.None;
  public nsfwLevel: GuildNSFWLevel = GuildNSFWLevel.Default;
  public verificationLevel: GuildVerificationLevel =
    GuildVerificationLevel.None;
  public explicitContentFilter: GuildExplicitContentFilter =
    GuildExplicitContentFilter.Disabled;

  public approximateMemberCount = 0;
  public approximatePresenceCount = 0;

  public memberCount: number | null = null;
  public presenceCount: number | null = null;

  public maxMembers = Infinity;
  public maxPresences = Infinity;
  public maxVideoChannelUsers = Infinity;

  public members = new GuildMemberManager(this.client, this.id);

  /** Whether the guild is considered large by Discord. */
  public large = false;

  public icon: string | null = null;
  public banner: string | null = null;
  public splash: string | null = null;
  public discoverySplash: string | null = null;

  public joinedAt?: Date;
  public get joinedTimestamp() {
    return this.joinedAt!.getTime();
  }

  public premiumTier: GuildPremiumTier = GuildPremiumTier.None;
  public premiumSubscriptionCount = 0;
  public premiumProgressBarEnabled = false;

  public defaultMessageNotifications: GuildDefaultMessageNotifications =
    GuildDefaultMessageNotifications.AllMessages;

  public vanityURLCode: string | null = null;

  public afkTimeout: number | null = null;
  public afkChannelId: Snowflake | null = null;
  public widgetEnabled = false;
  public widgetChannelId: Snowflake | null = null;
  public rulesChannelId: Snowflake | null = null;
  public systemChannelId: Snowflake | null = null;
  public systemChannelFlags: GuildSystemChannelFlags | null = null;
  public publicUpdatesChannelId: Snowflake | null = null;

  public channels: GuildChannelManager;

  constructor(client: Client) {
    super(client);

    this.channels = new GuildChannelManager(this);
  }

  /**
   * @internal
   * @private
   */
  _deserialise(data: APIGuild | APIUnavailableGuild) {
    this.id = data.id as Snowflake;
    this.members.guildId = this.id;
    this.available = !data.unavailable;

    data = data as APIGuild;

    if ('name' in data) this.name = data.name;
    if ('description' in data) this.description = data.description;
    if ('preferred_locale' in data)
      this.preferredLocale = data.preferred_locale ?? 'en_US';
    if ('owner_id' in data) this.ownerId = data.owner_id as Snowflake;
    if ('application_id' in data)
      this.applicationId = data.application_id as Snowflake;
    if ('features' in data) this.features = data.features;
    if ('mfa_level' in data) this.mfaLevel = data.mfa_level;
    if ('nsfw_level' in data) this.nsfwLevel = data.nsfw_level;
    if ('rules_channel_id' in data)
      this.rulesChannelId = data.rules_channel_id as Snowflake;
    if ('system_channel_id' in data)
      this.systemChannelId = data.system_channel_id as Snowflake;
    if ('system_channel_flags' in data)
      this.systemChannelFlags = new GuildSystemChannelFlags(
        data.system_channel_flags,
      );
    if ('approximate_member_count' in data)
      this.approximateMemberCount = data.approximate_member_count!;
    if ('approximate_presence_count' in data)
      this.approximatePresenceCount = data.approximate_presence_count!;
    if ('large' in data) this.large = !!data.large;
    if ('icon' in data || 'icon_hash' in data)
      this.icon = data.icon_hash ?? data.icon;
    if ('banner' in data) this.banner = data.banner;
    if ('splash' in data) this.splash = data.splash;
    if ('discovery_splash' in data)
      this.discoverySplash = data.discovery_splash;
    if ('afk_timeout' in data) this.afkTimeout = data.afk_timeout;
    if ('afk_channel_id' in data) {
      /* assign the channel, TODO */
      this.afkChannelId = data.afk_channel_id as Snowflake;
    }
    if ('verification_level' in data)
      this.verificationLevel = data.verification_level;
    if ('explicit_content_filter' in data)
      this.explicitContentFilter = data.explicit_content_filter;
    if ('widget_enabled' in data) this.widgetEnabled = data.widget_enabled!;
    if ('widget_channel_id' in data) {
      /* assign the channel, TODO */
      this.widgetChannelId = data.widget_channel_id! as Snowflake;
    }
    if ('public_updates_channel_id' in data) {
      this.publicUpdatesChannelId = data.public_updates_channel_id as Snowflake;
    }
    if ('premium_tier' in data) this.premiumTier = data.premium_tier;
    if ('premium_subscription_count' in data)
      this.premiumSubscriptionCount = data.premium_subscription_count!;
    if ('premium_progress_bar_enabled' in data)
      this.premiumProgressBarEnabled = data.premium_progress_bar_enabled;
    if ('member_count' in data) {
      this.approximateMemberCount = data.member_count!;
      this.memberCount = data.member_count!;
    }
    if ('presences' in data) {
      // TODO: presences
      this.presenceCount = data.presences!.length;
      this.approximatePresenceCount = data.presences!.length;
    }
    if ('default_message_notifications' in data)
      this.defaultMessageNotifications = data.default_message_notifications;
    if ('max_members' in data) this.maxMembers = data.max_members!;
    if ('max_presences' in data) this.maxPresences = data.max_presences!;
    if ('max_video_channel_users' in data)
      this.maxVideoChannelUsers = data.max_video_channel_users!;
    if ('vanity_url_code' in data) this.vanityURLCode = data.vanity_url_code;

    if ('joined_at' in data) this.joinedAt = new Date(data.joined_at!);

    if ('members' in data) {
      for (const member of data.members!) {
        const m = new GuildMember(this.client, this.id)._deserialise(member);
        this.members.cache.set(m.userId!, m);
      }
    }

    if ('channels' in data) {
      this.channels.addMany(
        data.channels!.map(v =>
          GuildChannel.resolve(
            this.client,
            v as APIGuildChannel<GuildChannelType>,
            this,
          ),
        ),
      );
    }

    return this;
  }

  public fetch(force = true) {
    return this.client.guilds.fetch(this.id, force);
  }

  public async edit(data: Partial<APIGuild | Guild>, reason?: string) {
    return this._deserialise(
      await this.client.http
        .queue({
          route: Routes.guild(this.id),
          method: 'PATCH',
          body: DataTransformer.asJSON(data),
          reason,
        })
        .then(v => v.body.json()),
    );
  }

  public async setIcon(icon: FileResolvable | null, reason?: string) {
    return this.edit(
      { icon: icon ? toDataURI(await resolveFile(icon)) : null },
      reason,
    );
  }

  public async setBanner(banner: FileResolvable | null, reason?: string) {
    return this.edit(
      {
        banner: banner ? toDataURI(await resolveFile(banner)) : null,
      },
      reason,
    );
  }

  public async setSplash(splash: FileResolvable | null, reason?: string) {
    return this.edit(
      {
        splash: splash ? toDataURI(await resolveFile(splash)) : null,
      },
      reason,
    );
  }

  public async setDiscoverySplash(
    splash: FileResolvable | null,
    reason?: string,
  ) {
    return this.edit(
      {
        discovery_splash: splash ? toDataURI(await resolveFile(splash)) : null,
      },
      reason,
    );
  }

  public setName(name: string, reason?: string) {
    return this.edit({ name }, reason);
  }

  /**
   * @deprecated use {@link VoiceChannel.setRTCRegion} instead
   */
  public setRegion(region: string, reason?: string) {
    return this.edit({ region }, reason);
  }

  public setAFKTimeout(timeout: number, reason?: string) {
    return this.edit({ afk_timeout: timeout }, reason);
  }

  public setAFKChannel(channel: Snowflake, reason?: string) {
    return this.edit({ afk_channel_id: channel }, reason);
  }

  public setSystemChannel(channel: Snowflake, reason?: string) {
    return this.edit({ system_channel_id: channel }, reason);
  }

  public setSystemChannelFlags(
    flags: GuildSystemChannelFlags,
    reason?: string,
  ) {
    return this.edit({ system_channel_flags: flags.bits }, reason);
  }

  public setVerificationLevel(level: GuildVerificationLevel, reason?: string) {
    return this.edit({ verification_level: level }, reason);
  }

  public setExplicitContentFilter(
    filter: GuildExplicitContentFilter,
    reason?: string,
  ) {
    return this.edit({ explicit_content_filter: filter }, reason);
  }

  public setDefaultMessageNotifications(
    notifications: GuildDefaultMessageNotifications,
    reason?: string,
  ) {
    return this.edit({ default_message_notifications: notifications }, reason);
  }

  public setWidgetEnabled(enabled: boolean, reason?: string) {
    return this.edit({ widget_enabled: enabled }, reason);
  }

  public setWidgetChannel(channel: Snowflake, reason?: string) {
    return this.edit({ widget_channel_id: channel }, reason);
  }

  public setPublicUpdatesChannel(channel: Snowflake, reason?: string) {
    return this.edit({ public_updates_channel_id: channel }, reason);
  }

  public setMaxMembers(max: number, reason?: string) {
    return this.edit({ max_members: max }, reason);
  }

  public setMaxPresences(max: number, reason?: string) {
    return this.edit({ max_presences: max }, reason);
  }

  public setMaxVideoChannelUsers(max: number, reason?: string) {
    return this.edit({ max_video_channel_users: max }, reason);
  }

  public setVanityURLCode(code: string, reason?: string) {
    return this.edit({ vanity_url_code: code }, reason);
  }

  public setDescription(description: string, reason?: string) {
    return this.edit({ description }, reason);
  }

  public async delete() {
    await this.client.guilds.delete(this.id);
  }

  public async leave() {
    return this.client.guilds.leave(this.id);
  }

  public toJSON(): APIGuild {
    return {
      id: this.id,
      name: this.name ?? '',
      icon: this.icon,
      splash: this.splash,
      banner: this.banner,
      discovery_splash: this.discoverySplash,
      owner_id: this.ownerId,
      application_id: this.applicationId,
      owner: this.ownerId === this.client.user!.id,
      region: 'deprecated',
      afk_channel_id: this.afkChannelId,
      afk_timeout: this.afkTimeout ?? 0,
      widget_enabled: this.widgetEnabled,
      widget_channel_id: this.widgetChannelId,
      system_channel_id: this.systemChannelId,
      system_channel_flags: this.systemChannelFlags?.bits ?? 0,
      rules_channel_id: this.rulesChannelId,
      verification_level: this.verificationLevel,
      explicit_content_filter: this.explicitContentFilter,
      nsfw_level: this.nsfwLevel,
      default_message_notifications: this.defaultMessageNotifications,
      features: this.features,
      mfa_level: this.mfaLevel,
      joined_at: this.joinedAt?.toISOString(),
      large: this.large,
      unavailable: !this.available,
      approximate_member_count: this.approximateMemberCount,
      member_count: this.memberCount ?? 0,
      members: this.members.map(v => v.toJSON()),
      channels: this.channels.map(v => v.toJSON()),
      voice_states: [], // TODO
      approximate_presence_count: this.approximatePresenceCount,
      presences: [], // TODO
      max_presences: this.maxPresences ?? 0,
      max_members: this.maxMembers ?? 0,
      vanity_url_code: this.vanityURLCode,
      description: this.description,
      premium_tier: this.premiumTier,
      premium_subscription_count: this.premiumSubscriptionCount,
      preferred_locale: this.preferredLocale,
      public_updates_channel_id: this.publicUpdatesChannelId,
      max_video_channel_users: this.maxVideoChannelUsers ?? 0,
      roles: [], // TODO
      emojis: [], // TODO
      stickers: [], // TODO
      premium_progress_bar_enabled: this.premiumProgressBarEnabled,
    };
  }

  get createChannel() {
    return this.channels.create.bind(this.channels);
  }
}
