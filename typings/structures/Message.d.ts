import { BaseStructure } from './templates/BaseStructure';
import { APIMessage, MessageType } from '@splatterxl/discord-api-types';
import { User } from './User';
import { ExtendedUser } from './ExtendedUser';
import { MessageFlags } from '../util/bitfields/MessageFlags';
import { GuildMember } from './GuildMember';
import { Guild } from './Guild';
import { TextChannel } from './templates/BaseTextChannel';
export declare class Message<ChannelType extends TextChannel = TextChannel> extends BaseStructure<APIMessage> {
    nonce: string | number | null;
    guild: Guild | null;
    channel: ChannelType | null;
    tts: boolean;
    type: MessageType;
    flags: MessageFlags;
    pinned: boolean;
    author: User | ExtendedUser;
    member: GuildMember | null;
    content: string | null;
    get createdTimestamp(): number;
    get createdAt(): Date;
    _deserialise(data: APIMessage): this;
    _modify(data: Partial<APIMessage>): Promise<NonNullable<this>>;
    edit(content: string): Promise<NonNullable<this>>;
    delete(): Promise<void>;
}
