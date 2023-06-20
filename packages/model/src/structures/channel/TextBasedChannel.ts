import {
  APITextBasedChannel,
  ChannelType,
  Snowflake,
} from 'discord-api-types/v10';
import { BaseStructure } from '../BaseStructure';

export class TextBasedChannel extends BaseStructure<APITextBasedChannel> {
  id: Snowflake;
  type: ChannelType;
  name: string | null;

  lastMessageId: Snowflake | null;
  lastPinTimestamp: number | null;

  get lastPinAt(): Date | null {
    return this.lastPinTimestamp ? new Date(this.lastPinTimestamp) : null;
  }

  rateLimitPerUser: number | null;

  constructor(data: APITextBasedChannel) {
    super(data);

    this.id = data.id;
    this.type = data.type;
    this.name = data.name ?? null;

    this.lastMessageId = data.last_message_id ?? null;
    this.lastPinTimestamp = data.last_pin_timestamp ?? null;
    this.rateLimitPerUser = data.rate_limit_per_user ?? null;
  }
}
