import {
  APIChannel,
  APIChannelBase,
  APIGuildChannel,
  ChannelType,
  GuildChannelType,
  Routes,
} from '@splatterxl/discord-api-types';
import { Client } from '../client/Client.js';
import { Snowflake } from '../client/ClientOptions';
import { DataTransformer } from '../rest/DataTransformer';
import { consumeJSON } from '../rest/RequestManager.js';
import { DMChannel } from './DMChannel.js';
import { Guild } from './Guild';
import { GuildChannel, GuildChannels } from './GuildChannel.js';
import { BaseStructure } from './templates/BaseStructure';

export class Channel<T extends APIChannel = APIChannel> extends BaseStructure<T> {
  public type: ChannelType = ChannelType.GuildCategory;
  public guildId: Snowflake | null = null;
  public get guild(): Guild | null {
    return this.client.guilds.get(this.guildId!) ?? null;
  }

  _deserialise(data: T & { guild_id?: Snowflake }): this {
    this.id = data.id as Snowflake;
    if ('type' in data) this.type = data.type as ChannelType;
    if ('guild_id' in data) this.guildId = data.guild_id as Snowflake;

    return this;
  }

  static create(
    client: Client,
    data: APIChannelBase<ChannelType> & { guild_id?: Snowflake }
  ): Channels {
    if (data.guild_id)
      return GuildChannel.resolve(
        client,
        data as APIGuildChannel<GuildChannelType>,
        client.guilds.get(data.guild_id)!
      );
    else
      switch (data.type) {
        default:
          client.logger.warn(
            `Unknown channel type: ${data.type} (${ChannelType[data.type]})`
          );
          return new Channel(client)._deserialise(data);
      }
  }

  /**
   * @internal
   */
  edit(data: any) {
    return this.client.http
      
      .queue({
          route: Routes.channel(this.id),
          method: 'PATCH',
          body: DataTransformer.asJSON(data),
        })
      .then((d) => consumeJSON<T & { guild_id?: Snowflake }>(d))
      .then((data) => this._deserialise(data));
  }

  public delete() {
    return this.client.http.queue({
      route: Routes.channel(this.id),
      method: 'DELETE',
    });
  }

  public fetch() {
    return this.client.http
      .queue({
        route: Routes.channel(this.id),
        method: 'GET',
      })
      .then((d) => consumeJSON<T & { guild_id?: Snowflake }>(d))
      .then((data) => this._deserialise(data));
  }

  public toJSON(): T {
    return {
      id: this.id,
      type: this.type,
    } as T;
  }
}

export type Channels<
  T = DMChannel | GuildChannels | Channel,
  D = APIChannel
> = T & {
  id: Snowflake;
  _deserialise(data: D): T;
};
