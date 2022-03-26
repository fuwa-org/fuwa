import {
  APIGuildChannel,
  ChannelType,
  GuildChannelType,
} from '@splatterxl/discord-api-types';
import { Client } from '../client/Client.js';
import { Snowflake } from '../client/ClientOptions';
import { Channel } from './Channel';
import { Guild } from './Guild';
import { GuildTextChannel } from './GuildTextChannel.js';

export class GuildChannel<
  T extends APIGuildChannel<GuildChannelType> = APIGuildChannel<GuildChannelType>
> extends Channel<T> {
  public name = '';
  public position = 0;
  public nsfw = false;

  public parentId: Snowflake | null = null;
  public get parent() {
    return this.guild!.channels.get(this.parentId!);
  }

  _deserialise(data: T): this {
    super._deserialise(data as T & { guild_id: Snowflake });

    if ('name' in data) this.name = data.name!;
    if ('position' in data) this.position = data.position!;
    if ('nsfw' in data) this.nsfw = data.nsfw!;
    if ('parent_id' in data) this.parentId = data.parent_id! as Snowflake;

    return this;
  }

  public static resolve(
    client: Client,
    data: APIGuildChannel<GuildChannelType>,
    guild: Guild
  ): GuildChannels {
    switch (data.type as GuildChannelType) {
      case ChannelType.GuildText:
      case ChannelType.GuildNews:
        return new GuildTextChannel(client)._deserialise(
          data as unknown as any
        );
      default: {
        guild.client.logger.warn(
          `unknown guild channel type ${data.type} (${ChannelType[data.type]})`
        );
        return new GuildChannel(client)._deserialise(data as unknown as any);
      }
    }
  }

  public setName(name: string) {
    this.edit({ name });
  }

  public setPosition(position: number) {
    this.edit({ position });
  }

  public setNsfw(nsfw: boolean) {
    this.edit({ nsfw });
  }

  public setParent(parent: GuildChannels | Snowflake) {
    this.edit({
      parent_id: (parent as unknown as any).id
        ? (parent as unknown as any).id
        : parent,
    });
  }

  toJSON(): T {
    return {
      ...super.toJSON(),
      name: this.name,
      position: this.position,
      nsfw: this.nsfw,
      parent_id: this.parentId,
    };
  }
}

export type GuildChannels = GuildChannel | GuildTextChannel;
