import { Client } from '../../client/Client';
import { Snowflake } from '../../client/ClientOptions';

export class BaseManager<T extends { id: Snowflake }> {
  public cache: Map<Snowflake, T> = new Map();

  constructor(public client: Client) {}

  public get(id: T['id']): T | undefined {
    return this.cache.get(id);
  }

  public add(data: T) {
    this.cache.set(data.id, data);
  }

  public update(data: T) {
    this.cache.set(data.id, data);
  }

  public remove(id: Snowflake) {
    this.cache.delete(id);
  }
}
