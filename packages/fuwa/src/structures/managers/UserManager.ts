import { Routes, Snowflake } from 'discord-api-types/v10';
import { Client } from '../../client/Client.js';
import { ExtendedUser } from '../ExtendedUser.js';
import { User } from '../User.js';
import { BaseManager } from './BaseManager.js';

export class UserManager extends BaseManager<ExtendedUser | User> {
  constructor(client: Client) {
    super(client, User);
  }

  public async fetch(id: Snowflake, cache = false) {
    return this.client
      .rest(Routes.user(id))
      .get()
      .then((data: any) => {
        if (cache) {
          return this.resolve(data)!;
        } else {
          return new (data.id === this.client.user?.id ? ExtendedUser : User)(
            this.client,
          )._deserialise(data);
        }
      }) as Promise<ExtendedUser | User>;
  }

  public async fetchMe() {
    return this.fetch('@me' as Snowflake) as unknown as ExtendedUser;
  }
}
