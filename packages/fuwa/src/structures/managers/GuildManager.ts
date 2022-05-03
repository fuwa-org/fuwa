import {
  RESTPostAPIGuildsJSONBody,
  Routes,
  Snowflake,
} from 'discord-api-types/v10';
import { Client } from '../../client/Client';
import { CreateEntityOptions } from '../../util/util';
import { Guild } from '../Guild';
import { BaseManager } from './BaseManager';

export class GuildManager extends BaseManager<Guild> {
  constructor(client: Client) {
    super(client, Guild);
  }

  public async fetch(id: Snowflake, cache = false): Promise<Guild> {
    return this.client
      .rest(Routes.guild(id))
      .get<any>()
      .then(data => {
        if (cache) {
          return this.resolve(data)!;
        } else {
          return new Guild(this.client)._deserialise(data);
        }
      });
  }

  public async create(
    name: string,
    { cache, ...options }: CreateGuildOptions = {},
  ): Promise<Guild> {
    return this.client
      .rest(Routes.guilds())
      .post<any>({
        body: {
          name,
          ...options,
        },
      })
      .then(data => {
        if (cache) {
          return this.resolve(data)!;
        } else {
          return new Guild(this.client)._deserialise(data);
        }
      });
  }

  public async delete(id: Snowflake): Promise<void> {
    await this.client.http.queue({
      route: Routes.guild(id),
      method: 'DELETE',
    });
    this.delete(id);
  }

  public async leave(id: Snowflake): Promise<void> {
    await this.client.http.queue({
      route: Routes.guildMember(id, this.client.user!.id),
      method: 'DELETE',
    });
    this.delete(id);
  }
}

export type CreateGuildOptions = CreateEntityOptions &
  Omit<RESTPostAPIGuildsJSONBody, 'name'>;
