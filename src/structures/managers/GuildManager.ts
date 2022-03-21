import { APIGuild, Routes } from '@splatterxl/discord-api-types';
import { Client } from '../../client/Client';
import { Snowflake } from '../../client/ClientOptions';
import { Intents } from '../../util/bitfields/Intents';
import { Guild } from '../Guild';
import { BaseManager } from './BaseManager';

export class GuildManager extends BaseManager<Guild> {
  constructor(client: Client) {
    super(client, Guild);
  }

  public async fetch(id: Snowflake, force = false): Promise<Guild> {
    if (!force && this.cache.has(id)) {
      return this.get(id)!;
    } else {
      return this.client.http
        .queue({ route: Routes.guild(id) })
        .then(async (res) => {
          if (this.cache.has(id)) {
            this.cache.set(
              id,
              this.cache.get(id)!._deserialise(await res.body.json())
            );
          } else {
            // GUILD_CREATE guilds have specific fields which cannot be accessed when fetched
            this.add(
              new Guild(this.client)._deserialise(await res.body.json())
            );
          }

          return this.get(id)!;
        });
    }
  }

  public async create(
    data?: { name: string } & Partial<APIGuild>
  ): Promise<Guild> {
    const guild = await this.client.http
      .queue({
        route: '/guilds',
        method: 'POST',
        body: data,
      })
      .then((res) => res.body.json());

    return this.cache
      .set(guild.id, new Guild(this.client)._deserialise(guild))
      .get(guild.id)!;
  }

  public async delete(id: Snowflake): Promise<void> {
    await this.client.http.queue({
      route: Routes.guild(id),
      method: 'DELETE',
    });
    this.delete(id);
  }
}
