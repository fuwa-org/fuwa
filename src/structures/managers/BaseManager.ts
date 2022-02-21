import { Client } from "../../client/Client";
import { Snowflake } from "../../client/ClientOptions";

export class BaseManager<T extends { id: Snowflake }> {
  public cache: Map<Snowflake, T> = new Map();

  constructor(public client: Client) {}

  public add(data: T) {
    this.cache.set(data.id, data);
  }

  public remove(id: Snowflake) {
    this.cache.delete(id);
  }
}
