import { APIAttachment, Snowflake } from 'discord-api-types/v10';
import { BaseStructure } from '../BaseStructure';

export class MessageAttachment extends BaseStructure<APIAttachment> {
  id: Snowflake;
  filename: string;
  contentType: string | null;
  size: number;

  url: string;
  proxyURL: string;

  get imageURL() {
    return this.proxyURL ?? this.url;
  }

  height: number | null;
  width: number | null;

  ephemeral: boolean;

  duration_secs: number | null;
  waveform: string | null;

  isVoiceMessage() {
    return !!(this.duration_secs && this.waveform);
  }

  isImage() {
    return (
      this.contentType?.startsWith('image/') || !!(this.height && this.width)
    );
  }

  constructor(data: APIAttachment) {
    super(data);

    this.id = data.id;
    this.filename = data.filename;
    this.contentType = data.content_type ?? null;
    this.size = data.size;

    this.url = data.url;
    this.proxyURL = data.proxy_url;

    this.height = data.height ?? null;
    this.width = data.width ?? null;

    this.ephemeral = !!data.ephemeral;

    this.duration_secs = data.duration_secs ?? null;
    this.waveform = data.waveform ?? null;
  }

  toJSON(): APIAttachment {
    return {
      id: this.id,
      filename: this.filename,
      content_type: this.contentType ?? undefined,
      size: this.size,
      url: this.url,
      proxy_url: this.proxyURL,
      height: this.height,
      width: this.width,
      ephemeral: this.ephemeral,
      duration_secs: this.duration_secs ?? undefined,
      waveform: this.waveform ?? undefined,
    };
  }
}
