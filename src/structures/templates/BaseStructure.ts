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

  public client: Client;
  constructor(client: Client, data?: T) {
    Object.defineProperty(this, 'client', {
      value: client,
    });

    if ('id' in data && typeof data.id === 'string') this.id = data.id;
    if (data) this._deserialise(data);
  }

  abstract _deserialise(_data: T): void;

  /**
   * Transfers the specified properties from the source object to target.
   *
   * **Note**: if the specified key isn't available in the source, it falls back to the target's equivalent, which makes it especially useful for patching objects with new data.
   * @internal
   * @param source Object to copy from.
   * @param props Properties to copy.
   */
  inheritFrom<S>(
    source: S,
    props: (
      | (keyof S & keyof this)
      | [sourceKey: keyof this, targetKey: keyof this]
    )[]
  ) {
    for (const key of props) {
      if (typeof key === 'string') this[key] = source[key] ?? this[key];
      else if (Array.isArray(key))
        this[key[1]] = source[key[0]] ?? this[key[1]];
      else {
        for (const sourceKey in key) {
          if (typeof key[sourceKey] === 'string') {
            this[key[sourceKey]] = source[sourceKey] ?? this[key[sourceKey]];
          } else if (typeof key[sourceKey] === 'function') {
            const [k, v] = key[sourceKey](source[sourceKey]);

            this[k] = v ?? this[k];
          }
        }
      }
    }
    return this;
  }

  /**
   * Returns an API-ready object.
   * @internal
   */
  toJSON(): T {
    const o: T = {} as any;
    for (const k in this) {
      const n = DataTransformer.snakeCase(key);
      if (k.startsWith('_') || typeof this[k] === "function") continue;
      else if (this[k].isManager)
        o[n] =
          this[k].apiReadyCache() ??
          [...this[k].cache].map(([, V]) => BaseStructure.toJSON(V));
      else if (this[k].isStructure) o[n] = this[k].toJSON();
      else if (this[k] instanceof Array)
        o[n] = this[k].map((v) => BaseStructure.toJSON(v));
      else if (this[k] instanceof Date && !(k.replace(/At$/,"Timestamp") in this)) o[k] = this[k].getTime() / 1000;
      else if (this[k] instanceof Date && k.replace(/At$/,"Timestamp") in this) o[k] = this[k].getTime();
      else o[n] = DataTransformer.snakeCase(this[k]);
    }
  }

  public static toJSON(data: any): any {
    if (data.toJSON && typeof data.toJSON === 'function') return data.toJSON();
    else return DataTransformer.snakeCase(data);
  }

  public isStructure = true;
}
