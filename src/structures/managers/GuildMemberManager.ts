import { GatewayOpcodes, Routes } from '@splatterxl/discord-api-types';
import { Client } from '../../client/Client';
import { Snowflake } from '../../client/ClientOptions';
import { GuildMember } from '../GuildMember';
import { BaseManager } from './BaseManager';

export class GuildMemberManager extends BaseManager<GuildMember> {
  constructor(client: Client, public guildId: Snowflake) {
    super(client, GuildMember);
  }

  public async fetch(id?: Snowflake | '@me'): Promise<GuildMember> {
    const member = await this.client.http
      .queue({
        route: Routes.guildMember(this.guildId, id ?? '@me'),
      })
      .then(async (data) => this.resolve(await data.body.json())!);

    return member;
  }

  public requestMembers(ids: Snowflake[], limit = 50): void {
    this.client.ws!.send({
      op: GatewayOpcodes.RequestGuildMembers,
      d: {
        guild_id: this.guildId,
        user_ids: ids,
        limit,
      },
    });
  }

  public requestMembersWithQuery(query: string, limit = 50): void {
    this.client.ws!.send({
      op: GatewayOpcodes.RequestGuildMembers,
      d: {
        guild_id: this.guildId,
        query,
        limit,
      },
    });
  }

  public disableCommunicationFor(
    member: Snowflake | GuildMember,
    until: Date | number,
    reason?: string
  ): Promise<GuildMember> {
    return this.get(
      member instanceof GuildMember ? member.user!.id : member
    )!.disableCommunication(until, reason);
  }

  public ban(
    member: Snowflake | GuildMember,
    deleteMessageDays?: number,
    reason?: string
  ): Promise<void> {
    return this.get(member instanceof GuildMember ? member.id : member)!.ban(
      deleteMessageDays,
      reason
    );
  }
}
