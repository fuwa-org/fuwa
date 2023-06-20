import {
  APIApplication,
  APIMessage,
  MessageType,
  Snowflake,
} from 'discord-api-types/v10';
import { BaseStructure } from '../BaseStructure';
import { User } from '../User';
import { Application } from '../application/Application';
import { TextBasedChannel } from '../channel/TextBasedChannel';
import { MessageActivity } from './MessageActivity';
import { MessageAttachment } from './MessageAttachment';
import { MessageEmbed } from './MessageEmbed';
import { MessageMentions } from './MessageMentions';
import { MessageReaction } from './MessageReaction';

export class Message extends BaseStructure<APIMessage> {
  id: Snowflake;
  type: MessageType;
  channelId: Snowflake;
  author: User;

  thread?: TextBasedChannel;

  content: string | null;
  timestamp: number;
  editedTimestamp: number | null;
  tts: boolean;

  mentions: MessageMentions;

  attachments: MessageAttachment[] | null;
  embeds: MessageEmbed[] | null;
  reactions: MessageReaction[] | null;

  nonce: string | number | null;

  pinned: boolean;

  webhook_id: Snowflake | null;
  activity: MessageActivity | null;
  application?: Application | null;

  referencedMessage: Message | null;
  // TODO: interactions
  interaction = null;
  components = null;

  // TODO: stickers
  sticker_items = [];
  stickers = [];

  position: number | undefined;

  // TODO: role subs
  roleSubscriptionData = null;

  constructor(data: APIMessage) {
    super(data);

    this.id = data.id;
    this.type = data.type;
    this.channelId = data.channel_id;
    this.author = new User(data.author);

    this.content = data.content ?? null;
    this.timestamp = new Date(data.timestamp).getTime();
    this.editedTimestamp = data.edited_timestamp
      ? new Date(data.edited_timestamp).getTime()
      : null;
    this.tts = data.tts;

    this.mentions = new MessageMentions(
      data.mention_everyone,
      data.mentions,
      data.mention_roles,
      data.mention_channels,
    );

    this.attachments =
      data.attachments?.map(attachment => new MessageAttachment(attachment)) ??
      null;
    this.embeds = data.embeds?.map(embed => new MessageEmbed(embed)) ?? null;
    this.reactions =
      data.reactions?.map(reaction => new MessageReaction(reaction)) ?? null;

    this.nonce = data.nonce ?? null;

    this.pinned = !!data.pinned;

    this.webhook_id = data.webhook_id ?? null;
    this.activity = data.activity ? new MessageActivity(data.activity) : null;
    this.application = data.application
      ? new Application(data.application as APIApplication)
      : null;

    this.referencedMessage = data.referenced_message
      ? new Message(data.referenced_message)
      : null;
  }

  toJSON(): APIMessage {
    return {
      id: this.id,
      type: this.type,
      channel_id: this.channelId,
      author: this.author.toJSON(),
      content: this.content ?? '',
      timestamp: this.timestamp.toString(),
      edited_timestamp: this.editedTimestamp?.toString() ?? null,
      tts: this.tts,
      mention_everyone: this.mentions.everyone,
      mentions: this.mentions.users.map(user => user.toJSON()),
      mention_roles: this.mentions.roles,
      mention_channels: this.mentions.channels.map(channel => channel.toJSON()),
      attachments:
        this.attachments?.map(attachment => attachment.toJSON()) ?? [],
      embeds: this.embeds?.map(embed => embed.toJSON()) ?? [],
      reactions: this.reactions?.map(reaction => reaction.toJSON()),
      nonce: this.nonce ?? undefined,
      pinned: this.pinned,
      webhook_id: this.webhook_id ?? undefined,
      activity: this.activity?.toJSON(),
      application: this.application?.toJSON(),
      referenced_message: this.referencedMessage?.toJSON(),
    };
  }
}
