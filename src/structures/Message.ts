import { BaseStructure } from './templates/BaseStructure';
import { APIMessage, MessageType, Routes } from '@splatterxl/discord-api-types';
import { Snowflake } from '../client/ClientOptions';
import { User } from './User';
import { ExtendedUser } from './ExtendedUser';
import { MessageFlags } from '../util/bitfields/MessageFlags';
import { GuildMember } from './GuildMember';
import { Guild } from './Guild';
import { BaseTextChannel } from './templates/BaseTextChannel';
import { DiscordSnowflake } from '@sapphire/snowflake';
import { DataTransformer } from '../rest/DataTransformer';

// TODO: Add support for DM messages
export class Message<
  ChannelType extends BaseTextChannel
> extends BaseStructure<APIMessage> {
  public nonce: string | number | null = null;

  public guild: Guild | null = null;
  public channel: ChannelType | null = null;

  public tts = false;
  public type: MessageType = MessageType.Default;
  public flags: MessageFlags = new MessageFlags(0);
  public pinned = false;

  public author!: User | ExtendedUser;
  public member: GuildMember | null = null;
  public content: string | null = null;

  public get createdTimestamp() {
    return DiscordSnowflake.timestampFrom(this.id);
  }
  public get createdAt() {
    return new Date(this.createdTimestamp);
  }

  _deserialise(data: APIMessage): this {
    this.id = data.id as Snowflake;

    if ('guild_id' in data)
      this.guild = this.client.guilds.resolve(data.guild_id) ?? null;
    if ('channel_id' in data)
      this.channel =
        (this.client.channels.resolve(
          data.channel_id
        )! as unknown as ChannelType) ?? null;

    if ('tts' in data) this.tts = data.tts;
    if ('type' in data) this.type = data.type;
    if ('author' in data) {
      if (data.webhook_id) {
        // TODO: this.author = new Webhook(data.author);
      } else {
        this.author = this.client.users.resolve(data.author)!;
      }
    }
    if ('nonce' in data) this.nonce = data.nonce! ?? null;
    if ('flags' in data) this.flags = new MessageFlags(data.flags!);
    // TODO: embeds
    if ('pinned' in data) this.pinned = data.pinned;
    if ('content' in data) this.content = data.content;
    if ('member' in data)
      this.member = this.guild!.members.resolve(data.member!) ?? null;
    // TODO: attachments, mentions, applications, webhooks, reactions, references, etc.
    //
    return this;
  }

  _modify(data: Partial<APIMessage>): Promise<Message<ChannelType>> {
    return this.client.http
      .queue<APIMessage>({
        route: Routes.channelMessage(this.channel!.id, this.id),
        method: 'PATCH',
        body: DataTransformer.asJSON(data),
      })
      .then(
        async (data) =>
          <this>(
            this.channel!.messages.update(
              this._deserialise(await data.body.json())
            )!
          )
      );
  }

  public async edit(content: string) {
    return this._modify({ content });
  }
}
