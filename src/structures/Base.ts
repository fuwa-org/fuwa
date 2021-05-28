import { Client } from '../client';
export class Base<T = Record<string, unknown>> {
  client: Client;
  constructor(client: Client, data: T = {} as unknown as T, patch = true) {
    Object.defineProperty(this, 'client', { value: client, enumerable: false });
    patch ? this._patch(data) : null;
  }
  _patch(data: T): void {
    for (const x in data) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this[x] = data[x];
    }
  }
}
