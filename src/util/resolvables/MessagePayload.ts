// adapted from Discord.js

import {
  RESTPostAPIChannelMessageJSONBody,
  MessageFlags as APIMessageFlags,
  Routes,
} from 'discord-api-types/v10';
import { basename } from 'path';
import { Snowflake } from '../../client/ClientOptions';
import { APIRequest } from '../../rest/APIRequest';
import { MessageFlags } from '../bitfields/MessageFlags';
import {
  FileResolvable,
  mimeTypeFromExtension,
  ResolvedFile,
  resolveFile,
} from './FileResolvable';

export interface MessagePayload {
  content?: string;
  flags?: MessageFlags | APIMessageFlags;
  tts?: boolean;
  nonce?: string;
  attachments?: FileResolvable[] | MessagePayloadAttachment[];
  // embeds?: MessagePayloadEmbed[];
}

// TODO: references, embeds, attachments, etc.

export class MessagePayload {
  static from(value: MessagePayload | string): MessagePayload {
    if (value instanceof MessagePayload) return value;
    else if (typeof value === 'string')
      return new MessagePayload({ content: value });
    else if (typeof value === 'object') return new MessagePayload(value);
    else throw new TypeError('Expected MessagePayload, string, or object');
  }

  constructor(data: MessagePayload | Record<keyof MessagePayload, any>) {
    this.content = data.content;
    this.flags = data.flags;
    this.tts = data.tts;
    this.nonce = data.nonce;
    this.attachments = data.attachments;
    // this.embeds = data.embeds;
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

    if (this.contentType === 'application/octet-stream') {
      this.contentType = mimeTypeFromExtension(this.name.split('.').pop()!);
    }

    if (!this.name && this.options?.url) {
      this.name = basename(this.options.url);
    }

    return this;
  }
}

export async function payload2data(
  payload: MessagePayload,
  channel: Snowflake,
): Promise<APIRequest<RESTPostAPIChannelMessageJSONBody>> {
  const body: RESTPostAPIChannelMessageJSONBody = {
    content: payload.content,
    tts: payload.tts,
    nonce: payload.nonce,
    attachments: [],
  }

  const files: APIRequest["files"] = [];

  if (payload.attachments) {
    for (let i = 0; i < payload.attachments.length; i++) {
      const attachment = payload.attachments[i];

      if (attachment instanceof MessagePayloadAttachment) {
        const file = await attachment.resolve();

        if (attachment.description) {
          body.attachments!.push({
            id: i.toString(),
            filename: file.name,
            description: attachment.description,
          }); 
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

  if (payload.flags) {
    if (payload.flags instanceof MessageFlags) {
      body.flags = payload.flags.bits;
    } else {
      body.flags = payload.flags;
    }
  }

  return {
    route: Routes.channelMessages(channel),
    body,
    files,
    method: 'POST',
    payloadJson: true,
  }
}
