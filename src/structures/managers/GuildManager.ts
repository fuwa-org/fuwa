import { APIGuild, Routes } from '@splatterxl/discord-api-types';
import { Snowflake } from '../../client/ClientOptions';
import { APIRequest } from '../../rest/Request.js';
import { Guild } from '../Guild';
import { BaseManager } from './BaseManager';

export class GuildManager extends BaseManager<Guild> {
  public async fetch(id: Snowflake, force = false): Promise<Guild> {
    if (!force && this.cache.has(id)) {
      return this.get(id)!;
    } else {
      return APIRequest.get(Routes.guild(id))
        .send<APIGuild>(this.client.http)
        .then((res) => {
          if (this.cache.has(id)) {
            this.cache.set(id, this.cache.get(id)!._deserialise(res.data));
          } else {
            // GUILD_CREATE guilds have specific fields which cannot be accessed when fetched
            this.add(new Guild(this.client)._deserialise(res.data));
          }

          return this.get(id)!;
        });
    }
  }
}
