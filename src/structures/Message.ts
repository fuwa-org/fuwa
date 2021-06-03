import {
  APIEmbed,
  APIMessage,
  APIMessageInteraction,
  APIMessageReferenceSend,
  MessageType,
  Snowflake,
} from 'discord-api-types';
import { Client } from '../client';
import { CONSTANTS } from '../constants';
import { MessageContent, MessageOptions, MessageReplyTo } from '../types';
import { MessageFlags } from '../util/MessageFlags';
import { Base } from './Base';
import { MessageMentions } from './MessageMentions';
import { TextBasedChannel } from './TextBasedChannel';
import { User } from './User';
/** A Message sent in a text based channel. */
export class Message extends Base<APIMessage> {
  /** The message's author */
  author: User;
  /** The Channel the message was sent in. */
  channel: TextBasedChannel;
  /** The message's content. */
  content: string;
  /** Whether this message has been deleted or not. */
  deleted = false;
  /** The message's embeds. */
  embeds: APIEmbed[];
  /** The message's flags. */
  flags: MessageFlags;
  /** The {@link Guild} this message was created in */
  guild: Snowflake;
  /** The {@link Snowflake} of the message. */
  id: Snowflake;
  /** The interaction the message is a response to */
  interaction?: APIMessageInteraction;

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
    if ('channel_id' in data) {
      this.channel = this.client.channels.get(
        data.channel_id
      ) as TextBasedChannel;
      this.channel.messages.add(this);
      this.client.channels.set(this.channel.id, this.channel);
    }
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
    if ('guild_id' in data) this.guild = data.guild_id;
    this.interaction = data.interaction;
  }
  private _resolveMessage(data: MessageReplyTo): APIMessageReferenceSend {
    if (data instanceof Message)
      return {
        message_id: data.id,
        channel_id: data.channel.id,
        guild_id: data.guild,
      };
    else if (typeof data === 'string')
      return {
        message_id: data,
        channel_id: this.channel.id,
        guild_id: this.guild,
      };
    else
      return {
        message_id: data.id,
        guild_id: data.guild,
        channel_id: data.channel,
        fail_if_not_exists: data.failIfNotExists,
      };
  }
  async delete(): Promise<this> {
    const result = await this.client.request<''>(
      CONSTANTS.urls.message(this.channel.id, this.id)
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
      CONSTANTS.urls.message(this.channel.id, this.id),
      {
        data: {
          content,
          allowedMentions: {
            replied_user: options.allowedMentions?.repliedUser,
            ...options.allowedMentions,
          },
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
  /**
   * Send an inline reply to the message
   * @returns The new message.
   */
  async reply(
    content: string,
    {
      embed,
      allowedMentions = {},
      content: optionsDotContent,
      replyTo = this,
    }: MessageOptions = {}
  ): Promise<Message> {
    const result = await this.client.request<void, APIMessage>(
      CONSTANTS.urls.channelMessages(this.channel.id),
      {
        method: 'POST',
        data: {
          content: content || optionsDotContent || '',
          embed,
          allowed_mentions: {
            replied_user: allowedMentions.repliedUser,
            ...allowedMentions,
          },
          message_reference: this._resolveMessage(replyTo),
        },
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    if (!result.res.ok) throw result.data;
    return new Message(this.client, result.data);
  }
}
