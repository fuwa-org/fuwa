import { APIMessage, MessageType, Snowflake } from 'discord-api-types/v10';
import { BaseStructure } from './templates/BaseStructure';
import { User } from './User';
import { ExtendedUser } from './ExtendedUser';
import { MessageFlags } from '../util/bitfields/MessageFlags';
import { TextChannel } from './templates/BaseTextChannel';
import { MessageAttachment } from './MessageAttachment';
import { FileResolvable } from '../util/resolvables/FileResolvable';
import { MessagePayload, MessagePayloadAttachment, MessagePayloadData } from '../util/resolvables/MessagePayload';
import { File } from '../rest/APIRequest';
export declare class Message<ChannelType extends TextChannel = TextChannel> extends BaseStructure<APIMessage> {
    nonce: string | number | null;
    guildId: Snowflake | null;
    get guild(): import("./Guild").Guild | null;
    channelId: Snowflake;
    get channel(): ChannelType;
    tts: boolean;
    type: MessageType;
    flags: MessageFlags;
    pinned: boolean;
    author: User | ExtendedUser;
    get member(): import("./GuildMember").GuildMember | null;
    content: string;
    get createdTimestamp(): number;
    get createdAt(): Date;
    timestamp: number;
    editedTimestamp: number | null;
    get editedAt(): Date | null;
    attachments: MessageAttachment[];
    reference: MessageReference | null;
    _deserialise(data: APIMessage): this;
    _modify(data: Partial<APIMessage>, files?: File[]): Promise<this>;
    fetchMember(): Promise<import("./GuildMember").GuildMember> | Promise<null>;
    edit(content: string | MessagePayload | MessagePayloadData): Promise<this>;
    delete(): Promise<void>;
    setFlags(flags: MessageFlags | number): Promise<this>;
    suppressEmbeds(suppress: boolean): Promise<this>;
    removeAttachments(): Promise<this>;
    attach(...files: (FileResolvable | MessagePayloadAttachment)[]): Promise<this>;
    reply(content: string | MessagePayload | MessagePayloadData, cache?: boolean): Promise<Message<TextChannel>>;
    toJSON(): APIMessage;
}
export interface MessageReference {
    messageId: Snowflake;
    channelId: Snowflake;
    guildId: Snowflake;
}
