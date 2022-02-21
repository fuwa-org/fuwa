import { Snowflake } from "../client/ClientOptions";
import { Base } from "./Base";
import { APIGuild, APIUnavailableGuild, GuildDefaultMessageNotifications, GuildExplicitContentFilter, GuildFeature, GuildMFALevel, GuildNSFWLevel, GuildPremiumTier, GuildVerificationLevel } from "@splatterxl/discord-api-types";
import { GuildSystemChannelFlags } from "../util/GuildSystemChannelFlags";
export declare class Guild extends Base<APIGuild | APIUnavailableGuild> {
    id: Snowflake;
    available: boolean;
    name: string | null;
    description: string | null;
    ownerId: Snowflake;
    preferredLocale: string;
    features: GuildFeature[];
    mfaLevel: GuildMFALevel;
    nsfwLevel: GuildNSFWLevel;
    verificationLevel: GuildVerificationLevel;
    explicitContentFilter: GuildExplicitContentFilter;
    approximateMemberCount: number;
    approximatePresenceCount: number;
    memberCount: number | null;
    presenceCount: number | null;
    maxMembers: number;
    maxPresences: number;
    maxVideoChannelUsers: number;
    large: boolean;
    icon: string | null;
    banner: string | null;
    splash: string | null;
    discoverySplash: string | null;
    joined?: Date;
    get joinedTimestamp(): number;
    created: Date;
    get createdTimestamp(): number;
    premiumTier: GuildPremiumTier;
    premiumSubscriptionCount: number;
    premiumProgressBarEnabled: boolean;
    defaultMessageNotifications: GuildDefaultMessageNotifications;
    vanityURLCode: string | null;
    afkTimeout: number | null;
    afkChannelId: Snowflake | null;
    widgetEnabled: boolean;
    widgetChannelId: Snowflake | null;
    rulesChannelId: Snowflake | null;
    systemChannelId: Snowflake | null;
    systemChannelFlags: GuildSystemChannelFlags | null;
    publicUpdatesChannelId: Snowflake | null;
    _deserialise(data: APIGuild | APIUnavailableGuild): this;
}
