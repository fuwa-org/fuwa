import { APIGuildTextChannel, ChannelType } from 'discord-api-types/v10';
import { BaseGuildTextChannel } from './templates/BaseGuildTextChannel';

export class GuildTextChannel extends BaseGuildTextChannel {
  public topic: string | null = null;

  _deserialise(data: APIGuildTextChannel<ChannelType.GuildText>) {
    super._deserialise(data);

    if ('topic' in data) this.topic = data.topic! ?? null;

    return this;
  }

  toJSON(): APIGuildTextChannel<ChannelType.GuildText> {
    return {
      ...super.toJSON(),
      topic: this.topic ?? undefined,
    } as any;
  }
}
