import { APIUser, Routes } from '@splatterxl/discord-api-types';
import { Snowflake } from '../../client/ClientOptions.js';
import { ClientUser } from '../ClientUser.js';
import { User } from '../User.js';
import { BaseManager } from './BaseManager.js';

export class UserManager extends BaseManager<ClientUser | User> {
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

  public resolve(data: APIUser): ClientUser | User {
    if (this.cache.has(data.id as Snowflake)) {
      const user = this.cache.get(data.id as Snowflake)!._deserialise(data);

      this.update(user);

      return user;
    } else {
      const user = new (data.id === this.client.user!.id ? ClientUser : User)(
        this.client
      )._deserialise(data);

      this.add(user);

      return user;
    }
  }
}
