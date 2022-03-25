// adapted from Discord.js

import {
  RESTPostAPIChannelMessageJSONBody,
  MessageFlags as APIMessageFlags,
  Routes,
} from '@splatterxl/discord-api-types';
import { basename } from 'path';
import { Snowflake } from '../../client/ClientOptions';
import { APIRequest } from '../../rest/APIRequest';
import { MessageFlags } from '../bitfields/MessageFlags';
import {
  FileResolvable,
  mimeTypeFromExtension,
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
    Object.assign(this, Object.assign(DEFAULT, data));
  }
}

export class MessagePayloadAttachment {
  name!: string;
  data!: Buffer;
  contentType!: string;

  constructor(
    public options: {
      name?: string;
      url?: string;
      data?: Buffer | string;
      contentType?: string;
    } = {}
  ) {}

  public async resolve() {
    await resolveFile(
      this.options.data ? Buffer.from(this.options.data!) : this.options.url!
    ).then((file) => {
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
  channel: Snowflake
) {
  const data: APIRequest & {
    body?: Partial<Omit<RESTPostAPIChannelMessageJSONBody, 'attachments'>>;
  } = {
    route: Routes.channelMessages(channel),
    method: 'POST',
  };

  const body: typeof data['body'] = DEFAULT;

  if (payload.content) body.content = payload.content ?? null;
  if (payload.flags)
    body.flags =
      payload.flags instanceof MessageFlags
        ? payload.flags.bits
        : payload.flags;
  if (payload.tts) body.tts = payload.tts;
  if (payload.nonce) body.nonce = payload.nonce;

  if (payload.attachments) {
    data.files = await Promise.all(
      payload.attachments.map(async (attachment) => {
        if (attachment instanceof MessagePayloadAttachment) {
          const file = await attachment.resolve();

          return {
            filename: file.name,
            ...file,
          };
        } else {
          return resolveFile(attachment);
        }
      })
    );
  }

  data.body = body;
  data.body.attachments = null;

  return data;
}

const DEFAULT = {
  content: '',
  flags: 0,
  tts: false,
  nonce: null,
  embeds: null,
  attachments: null,
};
