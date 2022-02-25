import { Snowflake } from '../client/ClientOptions';
import { BaseStructure } from './templates/BaseStructure';
import { APIGuild, APIUnavailableGuild, GuildDefaultMessageNotifications, GuildExplicitContentFilter, GuildFeature, GuildMFALevel, GuildNSFWLevel, GuildPremiumTier, GuildVerificationLevel } from '@splatterxl/discord-api-types';
import { GuildSystemChannelFlags } from '../util/bitfields/GuildSystemChannelFlags';
import { FileResolvable } from '../util/resolvables/FileResolvable.js';
export declare class Guild extends BaseStructure<APIGuild | APIUnavailableGuild> {
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
    fetch(force?: boolean): Promise<Guild>;
    edit(data: Partial<APIGuild | Guild>, reason?: string): Promise<this>;
    setIcon(icon: FileResolvable, reason?: string): Promise<this>;
    setBanner(banner: FileResolvable, reason?: string): Promise<this>;
    setSplash(splash: FileResolvable, reason?: string): Promise<this>;
    setDiscoverySplash(splash: FileResolvable, reason?: string): Promise<this>;
    setName(name: string, reason?: string): Promise<this>;
    setRegion(region: string, reason?: string): Promise<this>;
    setAFKTimeout(timeout: number, reason?: string): Promise<this>;
    setAFKChannel(channel: Snowflake, reason?: string): Promise<this>;
    setSystemChannel(channel: Snowflake, reason?: string): Promise<this>;
    setSystemChannelFlags(flags: GuildSystemChannelFlags, reason?: string): Promise<this>;
    setVerificationLevel(level: GuildVerificationLevel, reason?: string): Promise<this>;
    setExplicitContentFilter(filter: GuildExplicitContentFilter, reason?: string): Promise<this>;
    setDefaultMessageNotifications(notifications: GuildDefaultMessageNotifications, reason?: string): Promise<this>;
    setWidgetEnabled(enabled: boolean, reason?: string): Promise<this>;
    setWidgetChannel(channel: Snowflake, reason?: string): Promise<this>;
    setPublicUpdatesChannel(channel: Snowflake, reason?: string): Promise<this>;
    setMaxMembers(max: number, reason?: string): Promise<this>;
    setMaxPresences(max: number, reason?: string): Promise<this>;
    setMaxVideoChannelUsers(max: number, reason?: string): Promise<this>;
    setVanityURLCode(code: string, reason?: string): Promise<this>;
    setDescription(description: string, reason?: string): Promise<this>;
    delete(): Promise<void>;
}
