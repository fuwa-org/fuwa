// adapted from Discord.js

import {
  RESTPostAPIChannelMessageJSONBody,
  MessageFlags as APIMessageFlags,
  APIMessage,
} from 'discord-api-types/v10';
import { basename } from 'path';
import { APIRequest, File } from '../../rest/APIRequest';
import { MessageFlags } from '../bitfields/MessageFlags';
import { FuwaError } from '../errors';
import { FirstArrayValue } from '../util';
import {
  FileResolvable,
  mimeTypeFromExtension,
  resolveFile,
} from './FileResolvable';

export interface MessagePayloadData {
  content?: string;
  flags?: MessageFlags | APIMessageFlags;
  tts?: boolean;
  nonce?: string;
  attachments?: (FileResolvable | MessagePayloadAttachment)[];
  // embeds?: MessagePayloadEmbed[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface MessagePayload extends MessagePayloadData {}

// TODO: references, embeds, attachments, etc.

export class MessagePayload {
  static from(
    value: MessagePayload | string | MessagePayloadData,
  ): MessagePayload {
    if (value instanceof MessagePayload) return value;
    else if (typeof value === 'string')
      return new MessagePayload({ content: value });
    else if (typeof value === 'object') return new MessagePayload(value);
    else
      throw new FuwaError(
        'INVALID_PARAMETER',
        'content',
        'string or MessagePayload',
      );
  }

  constructor(data: MessagePayload | MessagePayloadData) {
    this.content = data.content;
    this.flags = data.flags;
    this.tts = data.tts;
    this.nonce = data.nonce;
    this.attachments = data.attachments;
    // this.embeds = data.embeds;
  }

  async json(): Promise<{ body: Partial<APIMessage>; files: File[] }> {
    const body: Partial<APIMessage> = {
      content: this.content,
      tts: this.tts,
      nonce: this.nonce,
    };

    const files: APIRequest['files'] = [];

    if (this.attachments) {
      body.attachments ??= [];

      for (let i = 0; i < this.attachments.length; i++) {
        const attachment = this.attachments[i];

        if (attachment instanceof MessagePayloadAttachment) {
          const file = await attachment.resolve();

          if (attachment.description) {
            body.attachments!.push({
              id: i.toString(),
              filename: file.name,
              description: attachment.description,
            } as FirstArrayValue<RESTPostAPIChannelMessageJSONBody['attachments']>);
          }

          files.push({
            filename: file.name,
            data: file.data,
            contentType: file.contentType,
          });
        } else {
          const file = await resolveFile(attachment);

          files.push({
            filename: file.filename,
            data: file.data,
            contentType: file.mimeType,
          });
        }
      }
    }

    if (this.flags) {
      const flags = this.flags;

      if (flags instanceof MessageFlags) {
        body.flags = flags.bits;
      } else {
        body.flags = flags;
      }
    }

    return { body, files };
  }
}

export class MessagePayloadAttachment {
  name!: string;
  data!: Buffer;
  contentType!: string;
  description?: string;

  constructor(
    public options: {
      name?: string;
      url?: string;
      data?: Buffer | string;
      contentType?: string;
      description?: string;
    } = {},
  ) {
    if (options.description) this.description = options.description;
  }

  public async resolve() {
    await resolveFile(
      this.options.data ? Buffer.from(this.options.data!) : this.options.url!,
    ).then(file => {
      this.name = this.options.name!;
      this.data = file.data;
      this.contentType = file.mimeType;
    });

    if (!this.name && this.options?.url) {
      this.name = basename(this.options.url);
    }

    if (this.contentType === 'application/octet-stream') {
      this.contentType = mimeTypeFromExtension(this.name.split('.').pop()!);
    }

    return this;
  }
}
