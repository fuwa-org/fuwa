import {
  ChannelType,
  GuildChannelType,
  RESTPostAPIGuildChannelJSONBody,
  Routes,
  Snowflake,
} from 'discord-api-types/v10';
import { consumeJSON } from '../../rest/RequestManager';
import { DataResolver } from '../../util/DataResolver';
import { FuwaError } from '../../util/errors';
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

  public delete(id: Snowflake, reason?: string): Promise<void> {
    return this.client.http
      .queue({
        method: 'DELETE',
        route: Routes.channel(id),
        reason,
      })
      .then(() => {
        this.delete(id);
      });
  }

  public create(options: CreateGuildChannelOptions): Promise<GuildChannels>;
  public create(name: string, type: GuildChannelType): Promise<GuildChannels>;
  public create(
    name: string | CreateGuildChannelOptions,
    type: GuildChannelType = ChannelType.DM as GuildChannelType, // make overloads work
    options: CreateGuildChannelOptions = {
      name: '', // throw error if not set
      type: ChannelType.DM as GuildChannelType,
    },
  ): Promise<GuildChannels> {
    if (typeof name === 'object') options = name;
    else
      options = {
        ...options,
        name,
        type,
      };

    if (typeof options.name !== 'string' || options.name == '') {
      throw new FuwaError('INVALID_PARAMETER', 'name', 'a valid string');
    }

    options.type = DataResolver.guildChannelType(options.type!);

    return this.client.http
      .queue({
        body: {
          ...options,
          cache: undefined,
          reason: undefined,
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

export interface CreateGuildChannelOptions
  extends CreateEntityOptions,
    Omit<RESTPostAPIGuildChannelJSONBody, 'type'> {
  type: GuildChannelType;
}
