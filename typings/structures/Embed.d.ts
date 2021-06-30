import { COLORS } from '../constants';
/**
 * [Embeds](https://discord.com/developers/docs/resources/channel#embed-object-embed-structure) that can be used on {@link Message}s.
 * @example new Embed({ title: "Lorem Ipsum" }).setDescription("Hello, World!");
 */
export declare class Embed {
    /** The author of this embed. */
    author: Embed.Author;
    color: number | null;
    /** The description of this embed. */
    description: string | null;
    /** The footer of this embed. */
    footer: Embed.Footer;
    /** The timestamp displayed at the footer of the embed. */
    timestamp: Date | number | null;
    /** The title of this embed. */
    title: string | null;
    /** @deprecated This does not have any impact on the appearance of the embed and may be removed in a future API version. */
    type: string;
    /** The hyperlink of this embed's title. */
    url: string | null;
    get hexColor(): string;
    setAuthor(name: string, iconURL?: string, url?: string): this;
    setColor(color: ColorResolvable): this;
    setDescription(description: string): this;
    setFooter(text: string, iconURL?: string): this;
    setTimestamp(timestamp?: Date | number): this;
    setTitle(title: string): this;
    setURL(url: string): this;
}
export declare namespace Embed {
    interface Author {
        name: string | null;
        iconURL: string | null;
        proxyIconURL: string | null;
        url: string | null;
    }
    interface Footer {
        text: string | null;
        iconURL: string | null;
        proxyIconURL: string | null;
    }
}
export declare type ColorResolvable = number | `#${string}` | keyof typeof COLORS | 'RANDOM';
