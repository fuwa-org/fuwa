import { APIAttachment, Snowflake } from 'discord-api-types/v10';
import { BaseStructure } from './templates/BaseStructure';

export class MessageAttachment extends BaseStructure<APIAttachment> {
  public url!: string;
  public proxyURL!: string;
  public filename!: string;
  public description: string | null = null;
  public size!: number;
  public width: number | null = null;
  public height: number | null = null;

  public ephemeral: boolean | null = null;
  public contentType: string | null = null;

  _deserialise(data: APIAttachment): this {
    if ('id' in data) this.id = data.id as Snowflake;
    if ('url' in data) this.url = data.url;
    if ('size' in data) this.size = data.size;
    if ('width' in data) this.width = data.width ?? null;
    if ('height' in data) this.height = data.height ?? null;
    if ('filename' in data) this.filename = data.filename ?? null;
    if ('proxy_url' in data) this.proxyURL = data.proxy_url ?? null;
    if ('description' in data) this.description = data.description ?? null;
    if ('ephemeral' in data) this.ephemeral = data.ephemeral ?? null;
    if ('content_type' in data) this.contentType = data.content_type ?? null;

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
