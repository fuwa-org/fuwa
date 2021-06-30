import { COLORS } from '../constants';
import { Util } from '../util/util';
/**
 * [Embeds](https://discord.com/developers/docs/resources/channel#embed-object-embed-structure) that can be used on {@link Message}s.
 * @example new Embed({ title: "Lorem Ipsum" }).setDescription("Hello, World!");
 */
export class Embed {
  /** The author of this embed. */
  author: Embed.Author = {
    iconURL: null,
    proxyIconURL: null,
    url: null,
    name: null,
  };
  color: number | null = null;
  /** The description of this embed. */
  description: string | null = null;
  /** The footer of this embed. */
  footer: Embed.Footer = {
    text: null,
    iconURL: null,
    proxyIconURL: null,
  };
  /** The timestamp displayed at the footer of the embed. */
  timestamp: Date | number | null = null;
  /** The title of this embed. */
  title: string | null = null;
  /** @deprecated This does not have any impact on the appearance of the embed and may be removed in a future API version. */
  type = 'rich';
  /** The hyperlink of this embed's title. */
  url: string | null = null;
  get hexColor(): string {
    return this.color.toString(16);
  }
  setAuthor(name: string, iconURL?: string, url?: string): this {
    this.author.name = name;
    if (iconURL) this.author.iconURL = iconURL;
    if (url) this.author.url = iconURL;
    return this;
  }

  setColor(color: ColorResolvable): this {
    this.color = Util.resolveColor(color);
    return this;
  }
  setDescription(description: string): this {
    this.description = description;
    return this;
  }
  setFooter(text: string, iconURL?: string): this {
    this.footer.text = text;
    if (iconURL) this.footer.iconURL = iconURL;
    return this;
  }
  setTimestamp(timestamp?: Date | number): this {
    if (!timestamp) this.timestamp = Date.now();
    else if (timestamp instanceof Date) {
      this.timestamp = timestamp.getTime();
    } else this.timestamp = timestamp;
    return this;
  }
  setTitle(title: string): this {
    this.title = title;
    return this;
  }

  setURL(url: string): this {
    this.url = url;
    return this;
  }
}
// eslint-disable @typescript-eslint/no-namespace
export namespace Embed {
  export interface Author {
    name: string | null;
    iconURL: string | null;
    proxyIconURL: string | null;
    url: string | null;
  }
  export interface Footer {
    text: string | null;
    iconURL: string | null;
    proxyIconURL: string | null;
  }
}
export type ColorResolvable =
  | number
  | `#${string}`
  | keyof typeof COLORS
  | 'RANDOM';
