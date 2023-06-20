import { APIEmbed } from 'discord-api-types/v10';
import { EmbedType } from '../../../../fuwa/src/structures/MessageEmbed';
import { BaseStructure } from '../BaseStructure';

export class MessageEmbed extends BaseStructure<APIEmbed> {
  title?: string;
  /**
   * @deprecated Embed types should be considered deprecated and might be removed in a future API version
   */
  type?: EmbedType;
  description?: string;
  url?: string;
  timestamp?: string;
  color?: number;
  footer?: {
    text: string;
    iconURL?: string;
    proxyIconURL?: string;
  };
  image?: {
    url: string;
    proxyURL?: string;
    height?: number;
    width?: number;
  };
  thumbnail?: {
    url: string;
    proxyURL?: string;
    height?: number;
    width?: number;
  };
  video?: {
    url: string;
    proxyURL?: string;
    height?: number;
    width?: number;
  };
  provider?: {
    name?: string;
    url?: string;
  };
  author?: {
    name: string;
    iconURL?: string;
    proxyIconURL?: string;
    url?: string;
  };
  fields?: {
    name: string;
    value: string;
    inline?: boolean;
  }[];

  constructor(data: APIEmbed) {
    super(data);

    this.title = data.title;
    this.type = data.type;
    this.description = data.description;
    this.url = data.url;
    this.timestamp = data.timestamp;
    this.color = data.color;
    this.footer = data.footer && {
      text: data.footer.text,
      iconURL: data.footer.icon_url,
      proxyIconURL: data.footer.proxy_icon_url,
    };
    this.image = data.image && {
      url: data.image.url,
      proxyURL: data.image.proxy_url,
      height: data.image.height,
      width: data.image.width,
    };
    this.thumbnail = data.thumbnail && {
      url: data.thumbnail.url,
      proxyURL: data.thumbnail.proxy_url,
      height: data.thumbnail.height,
      width: data.thumbnail.width,
    };
    this.video = data.video && {
      url: data.video.url!,
      proxyURL: data.video.proxy_url,
      height: data.video.height,
      width: data.video.width,
    };
    this.provider = data.provider && {
      name: data.provider.name,
      url: data.provider.url,
    };
    this.author = data.author && {
      name: data.author.name,
      iconURL: data.author.icon_url,
      proxyIconURL: data.author.proxy_icon_url,
      url: data.author.url,
    };
    this.fields = data.fields;
  }

  toJSON(): APIEmbed {
    return {
      title: this.title,
      type: this.type,
      description: this.description,
      url: this.url,
      timestamp: this.timestamp,
      color: this.color,
      footer: this.footer && {
        text: this.footer.text!,
        icon_url: this.footer.iconURL,
        proxy_icon_url: this.footer.proxyIconURL,
      },
      image: this.image && {
        url: this.image.url!,
        proxy_url: this.image.proxyURL,
        height: this.image.height,
        width: this.image.width,
      },
      thumbnail: this.thumbnail && {
        url: this.thumbnail.url!,
        proxy_url: this.thumbnail.proxyURL,
        height: this.thumbnail.height,
        width: this.thumbnail.width,
      },
      video: this.video && {
        url: this.video.url!,
        proxy_url: this.video.proxyURL,
        height: this.video.height,
        width: this.video.width,
      },
      provider: this.provider && {
        name: this.provider.name,
        url: this.provider.url,
      },
      author: this.author && {
        name: this.author.name!,
        icon_url: this.author.iconURL,
        proxy_icon_url: this.author.proxyIconURL,
        url: this.author.url,
      },
      fields: this.fields,
    };
  }
}
