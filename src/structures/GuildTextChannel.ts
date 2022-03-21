import { APIGuildTextChannel, ChannelType, GuildTextChannelType } from '@splatterxl/discord-api-types';
import { BaseGuildTextChannel } from './templates/BaseGuildTextChannel';

export class GuildTextChannel extends BaseGuildTextChannel {
  public topic: string | null = null;

  _deserialise(data: APIGuildTextChannel<ChannelType.GuildText>) {
    super._deserialise(data);

    if ("topic" in data) this.topic = data.topic! ?? null;

    return this;
  }
}


