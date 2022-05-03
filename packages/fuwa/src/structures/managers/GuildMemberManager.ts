import {
  APIGuildMember,
  RESTPutAPIGuildMemberJSONBody,
  Routes,
  Snowflake,
} from 'discord-api-types/v10';
import { Client } from '../../client/Client';
import { GuildMember } from '../GuildMember';
import { BaseManager } from './BaseManager';

export class GuildMemberManager extends BaseManager<GuildMember> {
  constructor(client: Client, public guildId: Snowflake) {
    super(client, GuildMember);
  }

  public async fetch(
    id: Snowflake | '@me',
    cache = false,
  ): Promise<GuildMember> {
    return this.client
      .rest(
        id === '@me'
          ? Routes.userGuildMember(this.guildId)
          : Routes.guildMember(this.guildId, id),
      )
      .get<APIGuildMember>()
      .then(data => {
        if (cache) return this.resolve(data)!;
        return new GuildMember(this.client, this.guildId)._deserialise(data);
      });
  }

  /*
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
  }*/

  public disableCommunicationFor(
    member: Snowflake | GuildMember,
    until: Date | number,
    reason?: string,
  ): Promise<GuildMember> {
    return this.get(
      member instanceof GuildMember ? member.user!.id : member,
    )!.disableCommunication(until, reason);
  }

  public async ban(
    member: Snowflake | GuildMember,
    { deleteMessageDays = 0, reason }: BanGuildMemberOptions = {},
  ): Promise<void> {
    await this.client.http.queue({
      route: Routes.guildBan(
        this.guildId,
        member instanceof GuildMember ? member.userId! : member,
      ),
      method: 'PUT',
      body: {
        delete_message_days: deleteMessageDays,
      },
      reason,
    });
  }

  public async unban(id: Snowflake, reason?: string): Promise<void> {
    await this.client.http.queue({
      route: Routes.guildBan(this.guildId, id),
      method: 'DELETE',
      reason,
    });
  }

  /**
   * Add a guild member to the guild using an OAuth2 access token. The access token requires the `guilds.join` scope.
   */
  public create(
    id: Snowflake,
    token: string,
    { cache = false, ...options }: AddGuildMemberOptions = {},
  ) {
    return this.client
      .rest(Routes.guildMember(this.guildId, id))
      .put<any>({
        body: {
          ...options,
          access_token: token,
        },
      })
      .then(data => {
        if (cache) {
          return this.resolve(data)!;
        } else {
          return new GuildMember(this.client, this.guildId)._deserialise(data);
        }
      });
  }
}

export interface AddGuildMemberOptions
  extends Omit<RESTPutAPIGuildMemberJSONBody, 'access_token'> {
  cache?: boolean;
}

export interface BanGuildMemberOptions {
  deleteMessageDays?: number;
  reason?: string;
}
