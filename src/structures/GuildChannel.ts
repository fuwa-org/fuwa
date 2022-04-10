import {
  APIGuildChannel,
  ChannelType,
  GuildChannelType,
} from 'discord-api-types/v10';
import { Client } from '../client/Client.js';
import { Snowflake } from '../client/ClientOptions';
import { Channel } from './Channel';
import { Guild } from './Guild';

export class GuildChannel<
  T extends APIGuildChannel<GuildChannelType> = APIGuildChannel<GuildChannelType>,
> extends Channel<T> {
  public name = '';
  public position = 0;
  public nsfw = false;

  public parentId: Snowflake | null = null;
  public get parent() {
    return this.guild!.channels.get(this.parentId!);
  }

  get children() {
    return [...this.guild!.channels.cache.values()].filter(
      channel => channel.parentId === this.id,
    );
  }

  _deserialise(data: T): this {
    super._deserialise(data as T & { guild_id: Snowflake });

    if ('name' in data) this.name = data.name!;
    if ('position' in data) this.position = data.position!;
    if ('nsfw' in data) this.nsfw = data.nsfw!;
    if ('parent_id' in data) this.parentId = data.parent_id! as Snowflake;

    return this;
  }

  /**
   * Creates a type-strong version of the channel, based on its type.
   */
  public static resolve(
    client: Client,
    data: APIGuildChannel<GuildChannelType>,
    guild: Guild,
  ): GuildChannels {
    switch (data.type as ChannelType) {
      case ChannelType.GuildText:
      case ChannelType.GuildNews:
        return new GuildTextChannel(client)

          ._deserialise(data as unknown as any)
          ._set_guild(guild.id);
      case ChannelType.GuildVoice:
      case ChannelType.GuildStageVoice:
        return new GuildVoiceChannel(client)

          ._deserialise(data as unknown as any)
          ._set_guild(guild.id);
      case ChannelType.GuildCategory:
        return new GuildChannel(client)
          ._deserialise(data as unknown as any)
          ._set_guild(guild.id);
      default:
        guild.client.logger.warn(
          `unknown guild channel type ${data.type} (${ChannelType[data.type]})`,
        );
        return new GuildChannel(client)._deserialise(data as unknown as any);
    }
  }

  public setName(name: string) {
    return this.edit({ name });
  }

  public setPosition(position: number) {
    return this.edit({ position });
  }

  public setNsfw(nsfw: boolean) {
    return this.edit({ nsfw });
  }

  public setParent(parent: GuildChannels | Snowflake) {
    this.edit({
      parent_id: (parent as unknown as any).id
        ? (parent as unknown as any).id
        : parent,
    });
  }

  public get delete() {
    return this.guild!.channels.delete.bind(this.guild!.channels, this.id);
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

export type GuildChannels = GuildChannel | GuildTextChannel | GuildVoiceChannel;

// BaseTextChannel depends on this file, but we depend on it
// in a function, so we import at the bottom of the file to avoid
// circular dependencies which result in a runtime error
import { GuildTextChannel } from './GuildTextChannel.js';
import { GuildVoiceChannel } from './GuildVoiceChannel.js';
