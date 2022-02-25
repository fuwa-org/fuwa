// @ts-nocheck Let's just hope this works.
import { Client } from '../../client/Client';

export abstract class BaseStructure<T> {
  client: Client;
  constructor(client: Client) {
    Object.defineProperty(this, 'client', {
      value: client,
    });
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
}