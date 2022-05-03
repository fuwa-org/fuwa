import { Channel, Channels } from '../Channel.js';
import { Client } from '../../client/Client.js';
import { Snowflake } from 'discord-api-types/globals';
import { BaseManager } from './BaseManager.js';
import { APIDMChannel, ChannelType, Routes } from 'discord-api-types/v10';
import { DMChannel } from '../DMChannel.js';

export class ChannelManager<
  T extends { id: Snowflake; _deserialise(data: any): T } = Channels,
> extends BaseManager<T> {
  constructor(client: Client, __class: any = Channel) {
    super(client, __class);
  }

  public resolve(data: any) {
    if (typeof data === 'string') {
      return this.get(data as Snowflake);
    } else {
      if (this.cache.has(data.id)) {
        return this.update(this.get(data.id)!._deserialise(data));
      } else {
        return this.add(Channel.create(this.client, data) as unknown as T);
      }
    }
  }

  public fetch(id: Snowflake, cache = false) {
    return this.client
      .rest(Routes.channel(id))
      .get<any>()
      .then(data => {
        if (cache) {
          return this.resolve(data)!;
        } else {
          return Channel.create(this.client, data) as unknown as T;
        }
      }) as Promise<T>;
  }

  public async createDM(user: Snowflake, cache = false): Promise<DMChannel> {
    if (this.dmChannel(user)) return this.dmChannel(user)!;

    return this.client
      .rest(Routes.userChannels())
      .post<APIDMChannel>({
        body: {
          recipient_id: user,
        },
      })
      .then(data => {
        if (cache) {
          return this.resolve(data)! as unknown as DMChannel;
        } else {
          return new DMChannel(this.client)._deserialise(data);
        }
      });
  }

  public dmChannel(id: Snowflake): DMChannel | null {
    for (const [, V] of this.cache) {
      const c = V as unknown as DMChannel;
      if (c.type === ChannelType.DM && c.recipientId === id)
        return V as unknown as DMChannel;
    }

    return null;
  }
}
