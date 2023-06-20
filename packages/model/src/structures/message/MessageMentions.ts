import { APIChannelMention, APIRole, APIUser } from 'discord-api-types/v10';
import { User } from '../User';
import { ChannelMention } from './ChannelMention';

export class MessageMentions {
  users: User[] = [];
  roles: APIRole['id'][] = [];
  channels: ChannelMention[] = [];

  constructor(
    public everyone: boolean,
    users: APIUser[],
    roles: APIRole['id'][],
    channels?: APIChannelMention[],
  ) {
    this.users = users.map(user => new User(user));
    this.roles = roles;
    this.channels = channels?.map(channel => new ChannelMention(channel)) ?? [];
  }
}
