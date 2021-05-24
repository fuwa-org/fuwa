import {
  APIEmbed,
  APIMessage,
  MessageType,
  Snowflake,
} from 'discord-api-types';
import { Client } from '../client';
import { MessageFlags } from '../util/MessageFlags';
import { Base } from './Base';
import { MessageMentions } from './MessageMentions';
import { User } from './User';
/** A Message sent in a text based channel. */
export class Message extends Base {
  /** The message's author */
  author: User;
  /** The {@link Channel} the message was sent in. */
  channel: Snowflake;
  /** The message's content. */
  content: string;
  /** The message's embeds. */
  embeds: APIEmbed[];
  /** The message's flags. */
  flags: MessageFlags;
  /** The {@link Snowflake} of the message. */
  id: Snowflake;
  /** Entities this message mentions */
  mentions: MessageMentions;
  /** A nonce that can be used for optimistic message sending (up to 25 characters) */
  nonce: string | number;
  /** Whether this is a TTS message */
  tts: boolean;
  /** The type of the message */
  type: MessageType;
  constructor(client: Client, data: APIMessage) {
    super(client);
    this._patch(data);
  }
  _patch(data: APIMessage): void {
    if ('id' in data) this.id = data.id;
    if ('channel_id' in data) this.channel = data.channel_id;
    this.mentions = new MessageMentions(
      this.client,
      data.mentions || [],
      data.mention_roles || [],
      data.mention_everyone || false,
      data.mention_channels || []
    );
    if ('content' in data) this.content = data.content;
    if ('author' in data) {
      if (this.client.users.has(data.author.id))
        this.author = this.client.users.get(data.author.id);
      else {
        this.author = new User(this.client, data.author);
        this.client.users.set(data.author.id, this.author);
      }
    }
    if ('type' in data) this.type = data.type;
    if ('tts' in data) this.tts = data.tts;
    if ('embeds' in data) this.embeds = data.embeds;
    if ('nonce' in data) this.nonce = data.nonce;
    this.flags = new MessageFlags(data.flags);
  }
}
