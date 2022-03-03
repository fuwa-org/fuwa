import { Client } from '../../client/Client';
import { Snowflake } from '../../client/ClientOptions';
import { GuildMember } from '../GuildMember';
import { BaseManager } from './BaseManager';
export declare class GuildMemberManager extends BaseManager<GuildMember> {
    guildId: Snowflake;
    constructor(client: Client, guildId: Snowflake);
    fetch(id?: Snowflake | '@me'): Promise<GuildMember>;
    requestMembers(ids: Snowflake[], limit?: number): void;
    requestMembersWithQuery(query: string, limit?: number): void;
    disableCommunicationFor(member: Snowflake | GuildMember, until: Date | number, reason?: string): Promise<GuildMember>;
    ban(member: Snowflake | GuildMember, deleteMessageDays?: number, reason?: string): Promise<void>;
}
