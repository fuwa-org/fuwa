import { Channel, Channels } from '../Channel.js';
import { Client } from '../../client/Client.js';
import { Snowflake } from '../../client/ClientOptions.js';
import { BaseManager } from './BaseManager.js';

export class ChannelManager<
  T extends { id: Snowflake; _deserialise(data: any): T } = Channels
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
}
