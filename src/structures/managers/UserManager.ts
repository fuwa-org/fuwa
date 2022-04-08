import { Routes } from 'discord-api-types/v10';
import { Client } from '../../client/Client.js';
import { Snowflake } from '../../client/ClientOptions.js';
import { ExtendedUser } from '../ExtendedUser.js';
import { User } from '../User.js';
import { BaseManager } from './BaseManager.js';

export class UserManager extends BaseManager<ExtendedUser | User> {
  constructor(client: Client) {
    super(client, User);
  }

  public async fetch(
    id: Snowflake,
    force = false
  ): Promise<ExtendedUser | User> {
    if (!force && this.cache.has(id)) {
      return this.get(id)!;
    } else {
      return this.client.http
        .queue({ route: Routes.user(id) })
        .then(async (res) => {
          if (this.cache.has(id)) {
            this.cache.set(
              id,
              this.cache.get(id)!._deserialise(await res.body.json())
            );
          } else {
            this.add(
              new (id === ('@me' as Snowflake) ? ExtendedUser : User)(
                this.client
              )._deserialise(await res.body.json())
            );
          }

          return this.get(id)!;
        });
    }
  }

  public async fetchCurrent(): Promise<ExtendedUser> {
    return this.fetch('@me' as Snowflake) as unknown as ExtendedUser;
  }
}
