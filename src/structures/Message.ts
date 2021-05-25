import {
  APIEmbed,
  APIMessage,
  MessageType,
  Snowflake,
} from 'discord-api-types';
import { Client } from '../client';
import { CONSTANTS } from '../constants';
import { MessageContent, MessageOptions } from '../types';
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
  /** Whether this message has been deleted or not. */
  deleted = false;
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
    if ('mentions' in data)
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
    if ('flags' in data) this.flags = new MessageFlags(data.flags);
  }
  async delete(): Promise<this> {
    const result = await this.client.request<''>(
      CONSTANTS.urls.message(this.channel, this.id)
    );
    if (!result.res.ok) throw result.data;
    this.deleted = true;
    return this;
  }
  async edit(
    content: MessageContent,
    options: MessageOptions = {}
  ): Promise<this> {
    const result = await this.client.request<void, APIMessage>(
      CONSTANTS.urls.message(this.channel, this.id),
      {
        data: {
          content,
          allowedMentions: options.allowedMentions,
          embed: options.embed,
        },
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'patch',
      }
    );
    if (!result.res.ok) throw result.data;
    this._patch(result.data);
    return this;
  }
}
