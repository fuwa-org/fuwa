import { APIDMChannel } from '@splatterxl/discord-api-types';
import { BaseTextChannel } from './templates/BaseTextChannel.js';
import { User } from './User.js';

export class DMChannel extends BaseTextChannel {
  public recipient!: User;

  _deserialise(data: APIDMChannel): this {
    super._deserialise(data);

    if ('recipients' in data)
      this.recipient = this.client.users.resolve(
        // bots can't participate in group dms, so we can assume there's only two recipients,
        // meaning we can map to the first that isn't the client
        data.recipients!.map((v) => v.id !== this.client.user!.id)[0]
      )! as User;

    return this;
  }

  toJSON(): APIDMChannel {
    return {
      ...super.toJSON(),
      recipients: [this.client.user!.toJSON(), this.recipient.toJSON()],
    } as APIDMChannel;
  }
}
