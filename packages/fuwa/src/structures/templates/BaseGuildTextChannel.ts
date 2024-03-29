import {
  APIGuildTextChannel,
  GuildTextChannelType,
} from 'discord-api-types/v10';
import { Client } from '../../client/Client.js';
import { BaseTextChannelInGuild } from './BaseTextChannel.js';

export class BaseGuildTextChannel extends BaseTextChannelInGuild {
  public lastPinAt: Date | null = null;
  public get lastPinTimestamp() {
    return this.lastPinAt?.getTime() ?? null;
  }

  constructor(client: Client) {
    super(client);
  }

  _deserialise(data: APIGuildTextChannel<GuildTextChannelType>) {
    super._deserialise(data);

    if ('last_pin_timestamp' in data)
      this.lastPinAt = data.last_pin_timestamp
        ? new Date(data.last_pin_timestamp!)
        : null;

    return this;
  }
}
