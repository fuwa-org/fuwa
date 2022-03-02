import { APIUser, Routes } from '@splatterxl/discord-api-types';
import { Client } from '../../client/Client.js';
import { Snowflake } from '../../client/ClientOptions.js';
import { ClientUser } from '../ClientUser.js';
import { User } from '../User.js';
import { BaseManager } from './BaseManager.js';

export class UserManager extends BaseManager<ClientUser | User> {
  constructor(client: Client) {
    super(client, User);
  }

  public async fetch(id: Snowflake, force = false): Promise<ClientUser | User> {
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
              new (id === ('@me' as Snowflake) ? ClientUser : User)(
                this.client
              )._deserialise(await res.body.json())
            );
          }

          return this.get(id)!;
        });
    }
  }

  public async fetchCurrent(): Promise<ClientUser> {
    return this.fetch('@me' as Snowflake) as unknown as ClientUser;
  }
}
