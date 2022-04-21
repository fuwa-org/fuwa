import type {
  APIEmbed,
  APIEmbedAuthor,
  APIEmbedFooter,
  APIEmbedImage,
  APIEmbedProvider,
  APIEmbedVideo,
  APIEmbedField,
  APIEmbedThumbnail,
} from 'discord-api-types/v10';
import { CamelCase, Null } from '../util/util';

export class MessageEmbed {
  public type: EmbedType = EmbedType.Rich;
  public url: string | null = null;

  public title: string | null = null;
  public description: string | null = null;
  public author: EmbedAuthor | null = null;
  public footer: EmbedFooter | null = null;
  public timestamp: number | null = null;

  public color: number | null = null;

  public image: EmbedImage | null = null;
  public video: EmbedVideo | null = null;
  public thumbnail: EmbedThumbnail | null = null;

  public provider: EmbedProvider | null = null;

  public fields: APIEmbedField[] = [];

  constructor(data: APIEmbed) {
    // avoid deprecation warning
    if ('type' in data) this.type = data['type' as keyof APIEmbed] as EmbedType;
    if ('url' in data) this.url = data.url ?? null;

    if ('title' in data) this.title = data.title ?? null;
    if ('description' in data) this.description = data.description ?? null;
    if ('author' in data)
      this.author =
        (data.author && {
          name: data.author.name,
          url: data.author.url ?? null,
          iconUrl: data.author.icon_url ?? null,
          proxyIconUrl: data.author.proxy_icon_url ?? null,
        }) ??
        null;
    if ('footer' in data)
      this.footer =
        (data.footer && {
          text: data.footer.text,
          iconUrl: data.footer.icon_url ?? null,
          proxyIconUrl: data.footer.proxy_icon_url ?? null,
        }) ??
        null;
    if ('timestamp' in data)
      this.timestamp =
        (data.timestamp && new Date(data.timestamp).getTime()) || null;

    if ('color' in data) this.color = data.color ?? null;

    if ('image' in data)
      this.image =
        (data.image && {
          url: data.image.url,
          height: data.image.height ?? null,
          width: data.image.width ?? null,
          proxyUrl: data.image.proxy_url ?? null,
        }) ??
        null;
    if ('video' in data)
      this.video =
        (data.video && {
          url: data.video.url,
          height: data.video.height ?? null,
          width: data.video.width ?? null,
        }) ??
        null;
    if ('thumbnail' in data)
      this.thumbnail =
        (data.thumbnail && {
          url: data.thumbnail.url,
          height: data.thumbnail.height ?? null,
          width: data.thumbnail.width ?? null,
          proxyUrl: data.thumbnail.proxy_url ?? null,
        }) ??
        null;

    if ('provider' in data)
      this.provider =
        (data.provider && {
          name: data.provider.name,
          url: data.provider.url ?? null,
        }) ??
        null;

    this.fields = data.fields ?? [];
  }

  public hexColor() {
    if (this.color) return this.color.toString(16);
    return null;
  }

  public timestampISO(): string | null {
    if (this.timestamp) return new Date(this.timestamp).toISOString();
    return null;
  }

  public timestampDate(): Date | null {
    if (this.timestamp) return new Date(this.timestamp);
    return null;
  }

  toJSON(): APIEmbed {
    return {
      type: this.type,
      url: this.url ?? undefined,
      title: this.title ?? undefined,
      description: this.description ?? undefined,
      author: this.author
        ? {
            name: this.author.name,
            url: this.author.url ?? undefined,
            icon_url: this.author.iconUrl ?? undefined,
            proxy_icon_url: this.author.proxyIconUrl ?? undefined,
          }
        : undefined,
      footer: this.footer
        ? {
            text: this.footer.text,
            icon_url: this.footer.iconUrl ?? undefined,
            proxy_icon_url: this.footer.proxyIconUrl ?? undefined,
          }
        : undefined,
      timestamp: this.timestamp
        ? new Date(this.timestamp).toISOString()
        : undefined,
      color: this.color ?? undefined,
      image: this.image
        ? {
            url: this.image.url,
            height: this.image.height ?? undefined,
            width: this.image.width ?? undefined,
            proxy_url: this.image.proxyUrl ?? undefined,
          }
        : undefined,
      video: this.video
        ? {
            url: this.video.url,
            height: this.video.height ?? undefined,
            width: this.video.width ?? undefined,
          }
        : undefined,
      thumbnail: this.thumbnail
        ? {
            url: this.thumbnail.url,
            height: this.thumbnail.height ?? undefined,
            width: this.thumbnail.width ?? undefined,
            proxy_url: this.thumbnail.proxyUrl ?? undefined,
          }
        : undefined,
      provider: this.provider
        ? {
            name: this.provider.name,
            url: this.provider.url ?? undefined,
          }
        : undefined,
      fields: this.fields,
    };
  }
}

// avoid deprecation warning
// eslint-disable-next-line @typescript-eslint/no-var-requires
export const EmbedType = require('discord-api-types/v10')
  .EmbedType as typeof import('discord-api-types/v10').EmbedType;
export type EmbedType = typeof EmbedType[keyof typeof EmbedType];

// types
export type EmbedImage = Null<CamelCase<APIEmbedImage>, 'url'>;
export type EmbedVideo = Null<CamelCase<APIEmbedVideo>, 'url'>;
export type EmbedThumbnail = Null<CamelCase<APIEmbedThumbnail>, 'url'>;
export type EmbedAuthor = Null<CamelCase<APIEmbedAuthor>, 'name'>;
export type EmbedFooter = Null<CamelCase<APIEmbedFooter>, 'text'>;
export type EmbedProvider = Null<CamelCase<APIEmbedProvider>, 'name'>;
export type { APIEmbedField as EmbedField } from 'discord-api-types/v10';
