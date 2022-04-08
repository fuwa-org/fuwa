import { APIDMChannel } from 'discord-api-types/v10';
import { Snowflake } from '../client/ClientOptions.js';
import { BaseTextChannel } from './templates/BaseTextChannel.js';
import { User } from './User.js';

export class DMChannel extends BaseTextChannel {
  public recipientId!: Snowflake;
  public get recipient(): User {
    return this.client.users.cache.get(this.recipientId)!;
  }

  _deserialise(data: APIDMChannel): this {
    super._deserialise(data);

    if ('recipients' in data)
      this.recipientId = this.client.users.resolve(
        // bots can't participate in group dms, so we can assume there's only two recipients,
        // meaning we can map to the first that isn't the client
        data.recipients!.filter((v) => v.id !== this.client.user!.id)[0]
      )!.id as Snowflake;

    return this;
  }

  toJSON(): APIDMChannel {
    return {
      ...super.toJSON(),
      recipients: [this.client.user!.toJSON(), this.recipient.toJSON()],
    } as APIDMChannel;
  }
}
