// @ts-nocheck Let's just hope this works.
import { DiscordSnowflake } from '@sapphire/snowflake';
import { Client } from '../../client/Client';
import { Snowflake } from '../../client/ClientOptions.js';
import { DataTransformer } from '../../rest/DataTransformer';

export abstract class BaseStructure<T> {
  public id!: Snowflake;

  public get createdAt(): Date {
    return DiscordSnowflake.timestampFrom(this.id);
  }
  public get createdTimestamp(): number {
    return this.createdAt.getTime();
  }

  constructor(public client: Client, data?: T) {
    Object.defineProperty(this, 'isStructure', {
      value: true,
      enumerable: false,
    });
    Object.defineProperty(this, 'client', {
      value: this.client,
      enumerable: false,
    });

    if (data) this._deserialise(data);
    if (data && 'id' in data && typeof data.id === 'string') this.id = data.id;
  }

  abstract _deserialise(_data: T): void;
  abstract toJSON(): T;

  public static toJSON(data: any): any {
    if (data.toJSON && typeof data.toJSON === 'function') return data.toJSON();
    else return DataTransformer.snakeCase(data);
  }
}
