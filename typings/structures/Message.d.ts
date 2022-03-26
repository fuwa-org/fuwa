import { BaseStructure } from './templates/BaseStructure';
import { APIMessage, MessageType } from '@splatterxl/discord-api-types';
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
    _modify(data: Partial<APIMessage>): Promise<NonNullable<this>>;
    fetchMember(): Promise<import("./GuildMember").GuildMember | null>;
    edit(content: string): Promise<NonNullable<this>>;
    delete(): Promise<void>;
    toJSON(): APIMessage;
}
export declare class MessageAttachment {
}
