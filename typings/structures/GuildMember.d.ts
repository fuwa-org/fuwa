import { APIGuildMember } from '@splatterxl/discord-api-types';
import { Client } from '../client/Client.js';
import { Snowflake } from '../client/ClientOptions.js';
import { Guild } from './Guild.js';
import { BaseStructure } from './templates/BaseStructure.js';
import { User } from './User.js';
export declare class GuildMember extends BaseStructure<APIGuildMember> {
    guildId: Snowflake;
    get createdAt(): Date;
    get createdTimestamp(): number;
    get guild(): Guild;
    userId: Snowflake | null;
    get user(): User | null;
    nickname: string | null;
    avatar: string | null;
    pending: boolean;
    communicationDisabledUntil: Date | null;
    get communicationDisabledUntilTimestamp(): number | null;
    joinedAt: Date;
    get joinedTimestamp(): number;
    premiumSince: Date | null;
    get premiumSinceTimestamp(): number | null;
    get isPremiumSupporter(): boolean;
    deaf: boolean;
    mute: boolean;
    constructor(client: Client, guildId: Snowflake);
    _deserialise(data: APIGuildMember & {
        joined_at: string | null;
    }): this;
    _patch(data: APIGuildMember, guild?: Guild, user?: User): this;
    fetch(): Promise<GuildMember>;
    edit(data: Partial<APIGuildMember | GuildMember>, reason?: string): Promise<GuildMember>;
    disableCommunication(until: Date | number, reason?: string): Promise<GuildMember>;
    ban(deleteMessageDays?: number, reason?: string): Promise<void>;
    unban(reason?: string): Promise<void>;
    kick(reason?: string): Promise<void>;
    setNickname(nickname: string, reason?: string): Promise<void>;
    setDeaf(deaf: boolean, reason?: string): Promise<void>;
    setMute(mute: boolean, reason?: string): Promise<void>;
    toJSON(): APIGuildMember;
}
export interface GuildMember {
    id: Snowflake;
}
