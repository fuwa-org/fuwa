import { BaseStructure } from './templates/BaseStructure';
import { APIMessage, MessageType } from 'discord-api-types/v10';
import { Snowflake } from '../client/ClientOptions';
import { User } from './User';
import { ExtendedUser } from './ExtendedUser';
import { MessageFlags } from '../util/bitfields/MessageFlags';
import { TextChannel } from './templates/BaseTextChannel';
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
    _deserialise(data: APIMessage): this;
    _modify(data: Partial<APIMessage>): Promise<this>;
    fetchMember(): Promise<import("./GuildMember").GuildMember | null>;
    edit(content: string): Promise<this>;
    delete(): Promise<void>;
    setFlags(flags: MessageFlags | number): Promise<this>;
    suppressEmbeds(suppress: boolean): Promise<this>;
    toJSON(): APIMessage;
}
export declare class MessageAttachment {
}
