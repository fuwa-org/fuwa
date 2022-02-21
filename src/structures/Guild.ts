import { Snowflake } from "../client/ClientOptions";
import { Base } from "./Base";
import { APIGuild, APIUnavailableGuild, GuildDefaultMessageNotifications, GuildExplicitContentFilter, GuildFeature, GuildMFALevel, GuildNSFWLevel, GuildPremiumTier, GuildVerificationLevel } from "@splatterxl/discord-api-types";
import { GuildSystemChannelFlags } from "../util/GuildSystemChannelFlags";
import { DiscordSnowflake } from "@sapphire/snowflake";

export class Guild extends Base<APIGuild | APIUnavailableGuild> {
  public id!: Snowflake;
  public available = false;

  public name: string | null = null;
  public description: string | null = null;
  public ownerId: Snowflake = "0";
  /* public get owner() {
    return this.client.users.cache.get(this.ownerId)
  } */
  public preferredLocale = "en_US";

  public features: GuildFeature[] = [];

  public mfaLevel: GuildMFALevel = GuildMFALevel.None;
  public nsfwLevel: GuildNSFWLevel = GuildNSFWLevel.Default;
  public verificationLevel: GuildVerificationLevel = GuildVerificationLevel.None;
  public explicitContentFilter: GuildExplicitContentFilter = GuildExplicitContentFilter.Disabled;

  public approximateMemberCount = 0;
  public approximatePresenceCount = 0;

  public memberCount: number | null = null;
  public presenceCount: number | null = null;

  public maxMembers = Infinity;
  public maxPresences = Infinity;
  public maxVideoChannelUsers = Infinity;

  /** Whether the guild is considered large by Discord. */
  public large = false;

  public icon: string | null = null;
  public banner: string | null = null;
  public splash: string | null = null;
  public discoverySplash: string | null = null;

  public joined?: Date;
  public get joinedTimestamp() {
    return this.joined!.getTime();
  }

  public created!: Date;
  public get createdTimestamp() {
    return this.created.getTime();
  }

   
  public premiumTier: GuildPremiumTier = GuildPremiumTier.None;
  public premiumSubscriptionCount = 0;
  public premiumProgressBarEnabled = false;

  public defaultMessageNotifications: GuildDefaultMessageNotifications = GuildDefaultMessageNotifications.AllMessages;

  public vanityURLCode: string | null = null;

  public afkTimeout: number | null = null;
  public afkChannelId: Snowflake | null = null;
  public widgetEnabled = false;
  public widgetChannelId: Snowflake | null = null;
  public rulesChannelId: Snowflake | null = null;
  public systemChannelId: Snowflake | null = null;
  public systemChannelFlags: GuildSystemChannelFlags | null = null;
  public publicUpdatesChannelId: Snowflake | null = null;
  
  /**
   * @internal
   * @private
   */
  _deserialise(data: APIGuild | APIUnavailableGuild) {
    this.id = data.id as Snowflake;
    this.available = !data.unavailable;
    this.created = new Date(DiscordSnowflake.timestampFrom(this.id))

    if (!data.unavailable) {
      data = data as APIGuild;
      

      if ("name" in data) this.name = data.name;
      if ("description" in data) this.description = data.description;
      if ("preferred_locale" in data) this.preferredLocale = data.preferred_locale ?? "en_US";
      if ("owner_id" in data) this.ownerId = data.owner_id as Snowflake;
      if ("features" in data) this.features = data.features;
      if ("mfa_level" in data) this.mfaLevel = data.mfa_level;
      if ("nsfw_level" in data) this.nsfwLevel = data.nsfw_level;
      if ("rules_channel_id" in data) this.rulesChannelId = data.rules_channel_id as Snowflake;
      if ("system_channel_id" in data) this.systemChannelId = data.system_channel_id as Snowflake;
      if ("system_channel_flags" in data) this.systemChannelFlags = new GuildSystemChannelFlags(data.system_channel_flags);
      if ("approximate_member_count" in data) this.approximateMemberCount = data.approximate_member_count!;
      if ("approximate_presence_count" in data) this.approximatePresenceCount = data.approximate_presence_count!;
      if ("large" in data) this.large = !!data.large;
      if ("icon" in data || "icon_hash" in data) this.icon = data.icon_hash ?? data.icon;
      if ("banner" in data) this.banner = data.banner;
      if ("splash" in data) this.splash = data.splash;
      if ("discovery_splash" in data) this.discoverySplash = data.discovery_splash;
      if ("afk_timeout" in data) this.afkTimeout = data.afk_timeout;
      if ("afk_channel_id" in data) {
        /* assign the channel, TODO */
        this.afkChannelId = data.afk_channel_id as Snowflake;
      }
      if ("verification_level" in data) this.verificationLevel = data.verification_level;
      if ("explicit_content_filter" in data) this.explicitContentFilter = data.explicit_content_filter;
      if ("widget_enabled" in data) this.widgetEnabled = data.widget_enabled!;
      if ("widget_channel_id" in data) {
        /* assign the channel, TODO */
        this.widgetChannelId = data.widget_channel_id! as Snowflake;
      }
      if ("public_updates_channel_id" in data) {
        this.publicUpdatesChannelId = data.public_updates_channel_id as Snowflake;
      }
      if ("premium_tier" in data) this.premiumTier = data.premium_tier;
      if ("premium_subscription_count" in data) this.premiumSubscriptionCount = data.premium_subscription_count!;
      if ("premium_progress_bar_enabled" in data) this.premiumProgressBarEnabled = data.premium_progress_bar_enabled;
      if ("member_count" in data) {
        this.approximateMemberCount = data.member_count!;
        this.memberCount = data.member_count!;
      }
      if ("presences" in data) {
        // TODO: presences 
        this.presenceCount = data.presences!.length;
        this.approximatePresenceCount = data.presences!.length;
      }
      if ("default_message_notifications" in data) this.defaultMessageNotifications = data.default_message_notifications;
      if ("max_members" in data) this.maxMembers = data.max_members!;
      if ("max_presences" in data) this.maxPresences = data.max_presences!;
      if ("max_video_channel_users" in data) this.maxVideoChannelUsers = data.max_video_channel_users!;
      if ("vanity_url_code" in data) this.vanityURLCode = data.vanity_url_code;

      if ("joined_at" in data) this.joined = new Date(data.joined_at!);
    }

    return this
  }
}
