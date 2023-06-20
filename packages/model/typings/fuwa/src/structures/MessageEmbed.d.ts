import type { APIEmbed, APIEmbedField } from 'discord-api-types/v10';
import { DeepPartial } from '../util/util';
export declare class MessageEmbed {
    type: EmbedType;
    url: string | null;
    title: string | null;
    description: string | null;
    author: EmbedAuthor | null;
    footer: EmbedFooter | null;
    timestamp: number | null;
    color: number | null;
    image: EmbedImage | null;
    video: EmbedVideo | null;
    thumbnail: EmbedThumbnail | null;
    provider: EmbedProvider | null;
    fields: APIEmbedField[];
    constructor(data: APIEmbed | MessageEmbed);
    from(data: APIEmbed): void;
    hexColor(): string | null;
    timestampISO(): string | null;
    timestampDate(): Date | null;
    toJSON(): APIEmbed;
    static snake(data: DeepPartial<IMessageEmbed & APIEmbed>): APIEmbed;
}
export declare const EmbedType: typeof import("discord-api-types/v10").EmbedType;
export type EmbedType = typeof EmbedType[keyof typeof EmbedType];
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
}
export interface EmbedThumbnail {
    url: string;
    height?: number | null;
    width?: number | null;
    proxyURL?: string | null;
}
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
