import { BaseStructure } from "./templates/BaseStructure";
import { APIMessage, MessageType } from "@splatterxl/discord-api-types";
import { Snowflake } from "../client/ClientOptions";
import { User } from "./User";
import { ClientUser } from "./ClientUser";
import { MessageFlags } from "../util/bitfields/MessageFlags";
import { GuildMember } from "./GuildMember";
import { Guild } from "./Guild";
import { BaseTextChannel } from "./templates/BaseTextChannel";
export declare class Message<ChannelType extends BaseTextChannel> extends BaseStructure<APIMessage> {
    id: Snowflake;
    nonce: string | number | null;
    guild: Guild | null;
    channel: ChannelType | null;
    tts: boolean;
    type: MessageType;
    flags: MessageFlags;
    pinned: boolean;
    author: User | ClientUser;
    member: GuildMember | null;
    content: string | null;
    get createdTimestamp(): number;
    get createdAt(): Date;
    _deserialise(data: APIMessage): this;
    _modify(data: Partial<APIMessage>): Promise<Message<ChannelType>>;
    edit(content: string): Promise<Message<ChannelType>>;
}
