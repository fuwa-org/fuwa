import {
  APIChannel,
  APIChannelBase,
  APIGuildChannel,
  ChannelType,
  GuildChannelType,
  Routes,
  Snowflake,
} from 'discord-api-types/v10';
import { Client } from '../client/Client.js';
import { Guild } from './Guild';
import { GuildTextChannel } from './GuildTextChannel.js';
import { GuildVoiceChannel } from './GuildVoiceChannel.js';
import { BaseStructure } from './templates/BaseStructure';
import { TextChannel } from './templates/BaseTextChannel.js';

export class Channel<
  T extends APIChannel = APIChannel,
> extends BaseStructure<T> {
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

  _set_guild(id: Snowflake) {
    this.guildId = id;
    return this;
  }

  static create(
    client: Client,
    data: APIChannelBase<ChannelType> & { guild_id?: Snowflake },
  ): Channels {
    if (data.guild_id)
      return GuildChannel.resolve(
        client,
        data as APIGuildChannel<GuildChannelType>,
        client.guilds.get(data.guild_id)!,
      );
    else
      switch (data.type) {
        case ChannelType.DM: {
          return new DMChannel(client)._deserialise(data as any);
        }
        default:
          client.logger.warn(
            `Unknown channel type: ${data.type} (${ChannelType[data.type]})`,
          );
          return new Channel(client)._deserialise(data as any);
      }
  }

  /**
   * @internal
   */
  edit(data: any) {
    return this.client
      .rest(Routes.channel(this.id))
      .patch<any>({ body: data })
      .then(data => this._deserialise(data));
  }

  public fetch() {
    return this.client
      .rest(Routes.channel(this.id))
      .get<any>()
      .then(data => this._deserialise(data));
  }

  public toJSON(): T {
    return {
      id: this.id,
      type: this.type,
      guild_id: this.guildId ?? undefined,
    } as T;
  }

  //#region Typeguards
  public isDM(): this is DMChannel {
    return this.type === ChannelType.DM;
  }
  public isGuild(): this is GuildChannels {
    return ChannelType[this.type].startsWith('Guild');
  }
  public isText(): this is GuildTextChannel {
    return this.type === ChannelType.GuildText;
  }
  public isVoice(): this is GuildVoiceChannel {
    return this.type === ChannelType.GuildVoice;
  }
  public isCategory(): this is GuildChannel {
    return this.type === ChannelType.GuildCategory;
  }
  public isTextBased(): this is TextChannel {
    return (
      this.type === ChannelType.GuildText ||
      this.type === ChannelType.DM ||
      this.type === ChannelType.GuildVoice
    );
  }
  public isVoiceBased(): this is GuildVoiceChannel {
    return (
      this.type === ChannelType.GuildVoice ||
      this.type === ChannelType.GuildStageVoice
    );
  }
}

export type Channels<
  T = GuildChannels | Channel | DMChannel,
  D = APIChannel,
> = T & {
  id: Snowflake;
  _deserialise(data: D): T;
};

import { GuildChannel, type GuildChannels } from './GuildChannel.js';
import { DMChannel } from './DMChannel.js';
