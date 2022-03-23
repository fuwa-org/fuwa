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
    Object.defineProperty(this, "isStructure", {
      value: true,
      enumerable: false,
    });
    Object.defineProperty(this, "client", {
      value: this.client,
      enumerable: false,
    });

    if (data) this._deserialise(data);
    if (data && 'id' in data && typeof data.id === 'string') this.id = data.id;
  }

  abstract _deserialise(_data: T): void;

  /**
   * Returns an API-ready object.
   * @internal
   */
  toJSON(): T {
    const o: T = {} as any;
    for (const k in this) {
      const n = DataTransformer.snakeCase(key);
      if (k.startsWith('_') || typeof this[k] === 'function') continue;
      else if (this[k].isManager)
        o[n] =
          this[k].apiReadyCache() ??
          [...this[k].cache].map(([, V]) => BaseStructure.toJSON(V));
      else if (this[k].isStructure) o[n] = this[k].toJSON();
      else if (this[k] instanceof Array)
        o[n] = this[k].map((v) => BaseStructure.toJSON(v));
      else if (
        this[k] instanceof Date &&
        !(k.replace(/At$/, 'Timestamp') in this)
      )
        o[k] = this[k].getTime() / 1000;
      else if (this[k] instanceof Date && k.replace(/At$/, 'Timestamp') in this)
        o[k] = this[k].getTime();
      else o[n] = DataTransformer.snakeCase(this[k]);
    }
  }

  public static toJSON(data: any): any {
    if (data.toJSON && typeof data.toJSON === 'function') return data.toJSON();
    else return DataTransformer.snakeCase(data);
  }
}
