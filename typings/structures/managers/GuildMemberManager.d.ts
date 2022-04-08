import { RESTPutAPIGuildMemberJSONBody } from 'discord-api-types/v10';
import { Client } from '../../client/Client';
import { Snowflake } from '../../client/ClientOptions';
import { GuildMember } from '../GuildMember';
import { BaseManager } from './BaseManager';
export declare class GuildMemberManager extends BaseManager<GuildMember> {
    guildId: Snowflake;
    constructor(client: Client, guildId: Snowflake);
    fetch(id?: Snowflake | '@me'): Promise<GuildMember>;
    disableCommunicationFor(member: Snowflake | GuildMember, until: Date | number, reason?: string): Promise<GuildMember>;
    ban(member: Snowflake | GuildMember, { deleteMessageDays, reason }?: BanGuildMemberOptions): Promise<void>;
    unban(id: Snowflake, reason?: string): Promise<void>;
    create(id: Snowflake, token: string, { cache, ...options }?: AddGuildMemberOptions): Promise<GuildMember>;
}
export interface AddGuildMemberOptions extends Omit<RESTPutAPIGuildMemberJSONBody, 'access_token'> {
    cache?: boolean;
}
export interface BanGuildMemberOptions {
    deleteMessageDays?: number;
    reason?: string;
}
