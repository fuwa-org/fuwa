import {
  APIMessage,
  MessageType,
  Routes,
  Snowflake,
} from 'discord-api-types/v10';
import { BaseStructure } from './templates/BaseStructure';
import { User } from './User';
import { ExtendedUser } from './ExtendedUser';
import { MessageFlags } from '../util/bitfields/MessageFlags';
import { TextChannel } from './templates/BaseTextChannel';
import { MessageAttachment } from './MessageAttachment';
import { FileResolvable } from '../util/resolvables/FileResolvable';
import {
  MessagePayload,
  MessagePayloadAttachment,
  MessagePayloadData,
} from '../util/resolvables/MessagePayload';
import { File } from '../rest/APIRequest';
import { MessageEmbed } from './MessageEmbed';

// TODO: Add support for DM messages
export class Message<
  ChannelType extends TextChannel = TextChannel,
> extends BaseStructure<APIMessage> {
  public nonce: string | number | null = null;

  public guildId: Snowflake | null = null;
  public get guild() {
    return this.client.guilds.get(this.guildId!) ?? null;
  }
  public channelId!: Snowflake;
  public get channel(): ChannelType {
    return this.client.channels.get(this.channelId)! as ChannelType;
  }

  public tts = false;
  public type: MessageType = MessageType.Default;
  public flags: MessageFlags = new MessageFlags(0);
  public pinned = false;

  public author!: User | ExtendedUser;
  public get member() {
    return this.guild?.members.get(this.author.id as Snowflake) ?? null;
  }
  public content!: string;

  public get createdTimestamp() {
    return this.timestamp;
  }
  public get createdAt() {
    return new Date(this.createdTimestamp);
  }

  public timestamp!: number;
  public editedTimestamp: number | null = null;
  public get editedAt() {
    return this.editedTimestamp ? new Date(this.editedTimestamp!) : null;
  }

  public attachments: MessageAttachment[] = [];

  public reference: MessageReference | null = null;
  public get referencedMessage(): Message | null {
    return (
      (this.reference && this.channel.messages.get(this.reference.messageId)) ??
      null
    );
  }

  public embeds: MessageEmbed[] = [];

  _deserialise(data: APIMessage): this {
    if ('id' in data) this.id = data.id as Snowflake;

    if ('guild_id' in data) this.guildId = data.guild_id as Snowflake;
    if ('channel_id' in data) this.channelId = data.channel_id as Snowflake;
    if ('tts' in data) this.tts = data.tts;
    if ('type' in data) this.type = data.type;
    if ('author' in data) {
      if (data.webhook_id) {
        this.author = new User(this.client, data.author);
      } else {
        this.author = this.client.users.resolve(data.author)!;
      }
    }
    if ('member' in data && !!data.member) {
      this.guild?.members.resolve(data.member!);
    }
    if ('nonce' in data) this.nonce = data.nonce! ?? null;
    if ('flags' in data) this.flags = new MessageFlags(data.flags!);
    if ('pinned' in data) this.pinned = data.pinned;
    if ('content' in data) this.content = data.content;
    if ('timestamp' in data)
      this.timestamp = new Date(data.timestamp).getTime();
    if ('edited_timestamp' in data)
      this.editedTimestamp = data.edited_timestamp
        ? new Date(data.edited_timestamp).getTime()
        : null;
    if ('attachments' in data)
      this.attachments = data.attachments.map(v =>
        new MessageAttachment(this.client)._deserialise(v),
      );
    if ('message_reference' in data)
      this.reference = {
        messageId: data.message_reference!.message_id!,
        channelId: data.message_reference!.channel_id!,
        guildId: data.message_reference!.guild_id!,
      };
    if ('embeds' in data)
      this.embeds = data.embeds.map(v => new MessageEmbed(v));

    // TODO: mentions, applications, webhooks, reactions, references, etc.

    return this;
  }

  _modify(data: Partial<APIMessage>, files?: File[]) {
    return this.client
      .rest(Routes.channelMessage(this.channelId, this.id))
      .patch<APIMessage>({ files, body: data })
      .then(this._deserialise.bind(this));
  }

  public fetchMember() {
    return this.guild?.members.fetch(this.author.id) ?? Promise.resolve(null);
  }

  public async edit(content: string | MessagePayload | MessagePayloadData) {
    const payload = await MessagePayload.from(content).json();

    return this._modify(payload.body as APIMessage, payload.files);
  }

  public async delete() {
    await this.client
      .rest(Routes.channelMessage(this.channelId, this.id))
      .delete({}, false)
      .then(() => this.channel!.messages.remove(this.id));
  }

  public setFlags(flags: MessageFlags | number) {
    return this.edit({
      flags: flags instanceof MessageFlags ? flags.bits : flags,
    });
  }

  /**
   * @alias Message.setFlags
   */
  public suppressEmbeds(suppress: boolean) {
    return this.setFlags(
      suppress
        ? this.flags.add(MessageFlags.Bits.SuppressEmbeds)
        : this.flags.remove(MessageFlags.Bits.SuppressEmbeds),
    );
  }

  public removeAttachments() {
    return this._modify({
      attachments: [],
    });
  }

  public async attach(...files: (FileResolvable | MessagePayloadAttachment)[]) {
    if (Array.isArray(files[0])) {
      files = files[0];
    }

    return this.edit({
      attachments: files,
    });
  }

  public reply(
    content: string | MessagePayload | MessagePayloadData,
    cache = false,
  ) {
    return this.channel.createMessage(
      {
        reference: {
          message: this.id,
        },
        ...(typeof content === 'string' ? { content } : content),
      },
      cache,
    );
  }

  toJSON(): APIMessage {
    return {
      id: this.id,
      guild_id: this.guildId ?? undefined,
      channel_id: this.channelId!,
      tts: this.tts,
      type: this.type,
      content: this.content ?? '',
      pinned: !!this.pinned,
      nonce: this.nonce ?? undefined,
      flags: this.flags.bits,
      author: this.author.toJSON(),
      timestamp: this.createdAt.toISOString(),
      edited_timestamp: this.editedAt?.toISOString() ?? null,
      mentions: [], // TODO
      mention_roles: [], // TODO
      mention_everyone: false, // TODO
      mention_channels: [], // TODO
      attachments: this.attachments.map(v => v.toJSON()),
      embeds: this.embeds.map(v => v.toJSON()),
    } as APIMessage;
  }
}

export interface MessageReference {
  messageId: Snowflake;
  channelId: Snowflake;
  guildId: Snowflake;
}
