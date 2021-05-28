import Collection from '@discordjs/collection';
import { APIGuild, Snowflake } from 'discord-api-types';
import { Client } from '../client';
import { Base } from './Base';
import { GuildChannel } from './GuildChannel';

export class Guild extends Base<APIGuild> {
  /** The guild's {@link GuildChannel|channel}s.
   *
   * <info> **ALL** channels in the guild are cached. This does not mean, however, that the Client has access to these channels.</info>
   */
  channels = new Collection<Snowflake, GuildChannel>();
  constructor(client: Client, data: APIGuild) {
    super(client, data, false);
    this._patch(data);
  }
  _patch(data: APIGuild) {
    for (const chan of data.channels || []) {
      this.channels.set(chan.id, new GuildChannel(this.client, chan));
    }
    super._patch(data);
  }
}
