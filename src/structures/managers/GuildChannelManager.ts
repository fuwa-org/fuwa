import { GuildChannelType, Routes } from 'discord-api-types/v10';
import { Snowflake } from '../../client/ClientOptions';
import { consumeJSON } from '../../rest/RequestManager';
import { CreateEntityOptions } from '../../util/util';
import { Guild } from '../Guild';
import { GuildChannel, GuildChannels } from '../GuildChannel';
import { ChannelManager } from './ChannelManager.js';

export class GuildChannelManager extends ChannelManager<GuildChannels> {
  constructor(public guild: Guild) {
    super(guild.client, GuildChannel);
  }

  public resolve(data: any): GuildChannels | undefined {
    if (typeof data === 'string') {
      return this.get(data as Snowflake);
    } else {
      if (this.cache.has(data.id)) {
        return this.update(this.get(data.id)!._deserialise(data));
      } else {
        return this.add(GuildChannel.resolve(this.client, data, this.guild));
      }
    }
  }

  public add(data: GuildChannels): GuildChannels {
    super.add(data);
    this.client.channels.add(data);
    return data;
  }

  public fetch(id: Snowflake, cache = false): Promise<GuildChannels> {
    return this.client.http
      .queue({
        route: Routes.channel(id),
      })
      .then(d => consumeJSON<any>(d))
      .then(data => {
        if (cache) {
          return this.resolve(data)!;
        } else {
          return GuildChannel.resolve(this.client, data, this.guild);
        }
      });
  }

  public create(
    name: string,
    type: GuildChannelType,
    options: CreateEntityOptions,
  ): Promise<GuildChannels> {
    return this.client.http
      .queue({
        body: {
          name,
          type,
        },
        method: 'POST',
        route: Routes.guildChannels(this.guild.id),
        reason: options.reason,
      })
      .then(d => consumeJSON<any>(d))
      .then(data => {
        if (options.cache) {
          return this.resolve(data)!;
        } else {
          return GuildChannel.resolve(this.client, data, this.guild);
        }
      });
  }
}
