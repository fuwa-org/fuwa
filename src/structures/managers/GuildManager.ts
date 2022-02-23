import { Routes } from '@splatterxl/discord-api-types';
import { Snowflake } from '../../client/ClientOptions';
import { Guild } from '../Guild';
import { BaseManager } from './BaseManager';

export class GuildManager extends BaseManager<Guild> {
  public async fetch(id: Snowflake, force = false): Promise<Guild> {
    if (!force && this.cache.has(id)) {
      return this.get(id)!;
    } else {
      return this.client.http.queue({ route: Routes.guild(id) })
        .then(async (res) => {
          if (this.cache.has(id)) {
            this.cache.set(id, this.cache.get(id)!._deserialise(await res.body.json()));
          } else {
            // GUILD_CREATE guilds have specific fields which cannot be accessed when fetched
            this.add(new Guild(this.client)._deserialise(await res.body.json()));
          }

          return this.get(id)!;
        });
    }
  }
}
