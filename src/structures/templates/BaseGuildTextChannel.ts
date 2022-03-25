import {
  APIGuildTextChannel,
  GuildTextChannelType,
} from '@splatterxl/discord-api-types';
import { Client } from '../../client/Client.js';
import { Guild } from '../Guild.js';
import { BaseTextChannel } from './BaseTextChannel.js';

export class BaseGuildTextChannel extends BaseTextChannel {
  public lastPinAt: Date | null = null;
  public get lastPinTimestamp() {
    return this.lastPinAt?.getTime() ?? null;
  }

  public nsfw = false;

  constructor(client: Client, public guild: Guild) {
    super(client);
  }

  _deserialise(data: APIGuildTextChannel<GuildTextChannelType>) {
    super._deserialise(data);

    if ('last_pin_timestamp' in data)
      this.lastPinAt = data.last_pin_timestamp
        ? new Date(data.last_pin_timestamp!)
        : null;
    if ('nsfw' in data) this.nsfw = !!data.nsfw;

    return this;
  }
}