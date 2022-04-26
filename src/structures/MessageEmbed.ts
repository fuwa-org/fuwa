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
import { CamelCase, DeepPartial, Null } from '../util/util';

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

  constructor(data: APIEmbed | MessageEmbed) {
    if (data instanceof MessageEmbed) this.from(data.toJSON());
    else this.from(MessageEmbed.snake(data));
  }

  from(data: APIEmbed) {
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
          iconURL: data.author.icon_url ?? null,
          proxyIconURL: data.author.proxy_icon_url ?? null,
        }) ??
        null;
    if ('footer' in data)
      this.footer =
        (data.footer && {
          text: data.footer.text,
          iconURL: data.footer.icon_url ?? null,
          proxyIconURL: data.footer.proxy_icon_url ?? null,
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
          proxyURL: data.image.proxy_url ?? null,
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
          proxyURL: data.thumbnail.proxy_url ?? null,
        }) ??
        null;

    if ('provider' in data)
      this.provider =
        (data.provider && {
          name: data.provider.name ?? null,
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
            icon_url: this.author.iconURL ?? undefined,
            proxy_icon_url: this.author.proxyIconURL ?? undefined,
          }
        : undefined,
      footer: this.footer
        ? {
            text: this.footer.text,
            icon_url: this.footer.iconURL ?? undefined,
            proxy_icon_url: this.footer.proxyIconURL ?? undefined,
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
            proxy_url: this.image.proxyURL ?? undefined,
          }
        : undefined,
      video: this.video
        ? {
            url: this.video.url ?? undefined,
            height: this.video.height ?? undefined,
            width: this.video.width ?? undefined,
          }
        : undefined,
      thumbnail: this.thumbnail
        ? {
            url: this.thumbnail.url,
            height: this.thumbnail.height ?? undefined,
            width: this.thumbnail.width ?? undefined,
            proxy_url: this.thumbnail.proxyURL ?? undefined,
          }
        : undefined,
      provider: this.provider
        ? {
            name: this.provider.name ?? undefined,
            url: this.provider.url ?? undefined,
          }
        : undefined,
      fields: this.fields,
    };
  }

  static snake(data: DeepPartial<IMessageEmbed & APIEmbed>): APIEmbed {
    return {
      ...data,
      thumbnail: data.thumbnail
        ? {
            ...data.thumbnail,
            proxy_url: data.thumbnail!.proxyURL ?? data.thumbnail!.proxy_url,
          }
        : undefined,
      image: data.image
        ? {
            ...data.image,
            proxy_url: data.image!.proxyURL ?? data.image!.proxy_url,
          }
        : undefined,
      footer: data.footer
        ? {
            icon_url: data.footer!.iconURL ?? data.footer!.icon_url,
            proxy_icon_url:
              data.footer!.proxyIconURL ?? data.footer!.proxy_icon_url,
          }
        : undefined,
      author: data.author
        ? {
            icon_url: data.author!.iconURL ?? data.author!.icon_url,
            proxy_icon_url:
              data.author!.proxyIconURL ?? data.author!.proxy_icon_url,
          }
        : undefined,
    } as APIEmbed;
  }
}

// avoid deprecation warning
// eslint-disable-next-line @typescript-eslint/no-var-requires
export const EmbedType = require('discord-api-types/v10')
  .EmbedType as typeof import('discord-api-types/v10').EmbedType;
export type EmbedType = typeof EmbedType[keyof typeof EmbedType];

// types
export interface EmbedImage {
  url: string;
  proxyURL?: string | null;
  height?: number | null;
  width?: number | null;
}
export interface EmbedVideo {
  url?: string | null;
  height?: number | null;
  width?: number | null;
};
export interface EmbedThumbnail {
  url: string;
  height?: number | null;
  width?: number | null;
  proxyURL?: string | null;
};
export interface EmbedAuthor {
  name: string;
  url?: string | null;
  iconURL?: string | null;
  proxyIconURL?: string | null;
}
export interface EmbedFooter {
  text: string;
  iconURL?: string | null;
  proxyIconURL?: string | null;
}
export interface EmbedProvider {
  name?: string | null;
  url?: string | null;
}
export interface EmbedField {
  name: string;
  value: string;
  inline?: boolean | null;
}

export interface IMessageEmbed {
  type?: EmbedType;
  title?: string;
  description?: string;
  url?: string;
  /** ISO8601 timestamp */
  timestamp?: string;
  color?: number;
  fields?: EmbedField[];
  author?: EmbedAuthor;
  footer?: EmbedFooter;
  image?: EmbedImage;
  thumbnail?: EmbedThumbnail;
  video?: EmbedVideo;
  provider?: EmbedProvider;
}
