import { Client } from '../../client/Client';
import { Snowflake } from '../../client/ClientOptions.js';
import { DataTransformer } from '../../rest/DataTransformer';
import { SnowflakeInfo } from '../../util/Snowflake';

export abstract class BaseStructure<T> {
  public id!: Snowflake;

  public get createdTimestamp() {
    return new SnowflakeInfo(this.id).timestamp;
  }
  public get createdAt() {
    return new Date(this.createdTimestamp);
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
  }

  abstract _deserialise(_data: T): void;
  abstract toJSON(): T;

  public static toJSON(data: any): any {
    if (data.toJSON && typeof data.toJSON === 'function') return data.toJSON();
    else return DataTransformer.snakeCase(data);
  }
}
