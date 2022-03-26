import { BaseStructure } from './templates/BaseStructure';
import { APIMessage, MessageType, Routes } from '@splatterxl/discord-api-types';
import { Snowflake } from '../client/ClientOptions';
import { User } from './User';
import { ExtendedUser } from './ExtendedUser';
import { MessageFlags } from '../util/bitfields/MessageFlags';
import { TextChannel } from './templates/BaseTextChannel';
import { DiscordSnowflake } from '@sapphire/snowflake';
import { DataTransformer } from '../rest/DataTransformer';

// TODO: Add support for DM messages
export class Message<
  ChannelType extends TextChannel = TextChannel
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
  public content: string | null = null;

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

  _deserialise(data: APIMessage): this {
    this.id = data.id as Snowflake;

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
    if ('nonce' in data) this.nonce = data.nonce! ?? null;
    if ('flags' in data) this.flags = new MessageFlags(data.flags!);
    // TODO: embeds
    if ('pinned' in data) this.pinned = data.pinned;
    if ('content' in data) this.content = data.content;
    if ('timestamp' in data)
      this.timestamp = new Date(data.timestamp).getTime();
    if ('edited_timestamp' in data)
      this.editedTimestamp = data.edited_timestamp
        ? new Date(data.edited_timestamp).getTime()
        : null;
    // TODO: attachments, mentions, applications, webhooks, reactions, references, etc.

    return this;
  }

  _modify(data: Partial<APIMessage>) {
    return this.client.http
      .queue<APIMessage>({
        route: Routes.channelMessage(this.channel!.id, this.id),
        method: 'PATCH',
        body: DataTransformer.asJSON(data),
      })
      .then(async (data) => this._deserialise(await data.body.json())!);
  }

  public async fetchMember() {
    return (
      this.guild?.members.add(
        await this.guild?.members.fetch(this.author.id)
      ) ?? null
    );
  }

  public async edit(content: string) {
    return this._modify({ content });
  }

  public async delete() {
    await this.client.http
      .queue<APIMessage>({
        route: Routes.channelMessage(this.channel!.id, this.id),
        method: 'DELETE',
      })
      .then(() => this.channel!.messages.remove(this.id));
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
      attachments: [], // TODO
      embeds: [], // TODO
    };
  }
}

export class MessageAttachment {}
