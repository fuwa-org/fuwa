import Collection from '@discordjs/collection';
import { APIChannelMention, APIMessage, Snowflake } from 'discord-api-types';
import { Client } from '../client';
import { User } from './User';
/** Keeps track of mentions in a {@link Message} */
export class MessageMentions {
  /** Channels mentioned in the message. */
  channels: APIChannelMention[] = [];
  client: Client;
  /** Whether or not @everyone/@here has been mentioned. */
  everyone = false;
  /** Roles mentioned in the message. */
  roles: Snowflake[];
  /** {@link User}s mentioned in the message. */
  users = new Collection<Snowflake, User>();
  constructor(
    client: Client,
    users: APIMessage['mentions'],
    roles: Snowflake[],
    everyone: boolean,
    channels?: APIChannelMention[]
  ) {
    this.client = client;
    for (const user of users) {
      if (this.client.users.has(user.id))
        this.users.set(user.id, this.client.users.get(user.id));
      else {
        this.client.users.set(user.id, new User(this.client, user));
        this.users.set(user.id, this.client.users.get(user.id));
      }
    }
    this.everyone = everyone;
    this.channels = channels;
    this.roles = roles;
  }
}
