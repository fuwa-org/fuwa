import { APIAttachment } from 'discord-api-types/v10';
import { Snowflake } from '../client/ClientOptions';
import { BaseStructure } from './templates/BaseStructure';

export class MessageAttachment extends BaseStructure<APIAttachment> {
  public url!: string;
  public proxyURL!: string;
  public filename!: string;
  public description: string | null = null;
  public size!: number;
  public width: number | null = null;
  public height: number | null = null;

  public ephemeral: true | null = null;
  public contentType: string | null = null;

  _deserialise(data: APIAttachment): this {
    this.id = data.id as Snowflake;

    if (data.url) this.url = data.url;
    if (data.size) this.size = data.size;
    if (data.width) this.width = data.width;
    if (data.height) this.height = data.height;
    if (data.filename) this.filename = data.filename;
    if (data.proxy_url) this.proxyURL = data.proxy_url;
    if (data.description) this.description = data.description;
    if (data.ephemeral) this.ephemeral = data.ephemeral;
    if (data.content_type) this.contentType = data.content_type;

    return this;
  }

  toJSON(): APIAttachment {
    return {
      id: this.id,
      url: this.url,
      proxy_url: this.proxyURL,
      filename: this.filename,
      description: this.description ?? undefined,
      size: this.size,
      width: this.width ?? undefined,
      height: this.height ?? undefined,
      ephemeral: this.ephemeral ?? undefined,
      content_type: this.contentType ?? undefined,
    };
  }
}
