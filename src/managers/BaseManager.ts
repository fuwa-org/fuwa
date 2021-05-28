import Collection from '@discordjs/collection';
import { Snowflake } from 'discord-api-types';
import { Client } from '../client';

export class BaseManager<T extends { id: Snowflake } = { id: Snowflake }> {
  cache = new Collection<Snowflake, T>();
  client: Client;
  constructor(client: Client) {
    this.client = client;
  }
  add(data: T): void {
    this.cache.set(data.id, data);
  }
  remove(data: T): void {
    this.cache.delete(data.id);
  }
}
