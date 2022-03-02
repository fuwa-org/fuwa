import { Client } from '../../client/Client';
import { Snowflake } from '../../client/ClientOptions';

export class BaseManager<
  T extends { id: Snowflake; _deserialise(data: any): T }
> {
  public cache: Map<Snowflake, T> = new Map();

  constructor(public client: Client, public __class: any) {}

  public get(id: T['id']): T | undefined {
    return this.cache.get(id);
  }

  public add(data: T) {
    this.cache.set(data.id, data);
  }

  public addMany(data: T[]) {
    for (const d of data) {
      this.add(d);
    }
  }

  public update(data: T): T {
    this.cache.set(data.id, data);
    return this.cache.get(data.id)!;
  }

  public remove(id: Snowflake) {
    this.cache.delete(id);
  }

  public resolve(data: Snowflake | any) {
    if (typeof data === 'string') {
      return this.get(data as T['id']);
    } else {
      if (this.cache.has(data.id)) {
        return this.update(this.get(data.id)!._deserialise(data));
      } else {
        return this.add(new this.__class(this.client)._deserialise(data));
      }
    }
  }

  public isManager = true;
}
