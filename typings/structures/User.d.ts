import { APIUser } from 'discord-api-types/v10';
import { UserFlags } from '../util/bitfields/UserFlags.js';
import { MessagePayload } from '../util/resolvables/MessagePayload.js';
import { DMChannel } from './DMChannel.js';
import { BaseStructure } from './templates/BaseStructure.js';
export declare class User extends BaseStructure<APIUser> {
    bot: boolean;
    system: boolean;
    flags: UserFlags;
    username: string;
    discriminator: string;
    get tag(): string;
    avatar: string | null;
    banner: string | null;
    dm: DMChannel | null;
    _deserialise(data: APIUser): this;
    toString(): string;
    fetch(): Promise<this>;
    createDM(cache?: boolean): Promise<DMChannel>;
    send(content: MessagePayload | string): Promise<import("./Message.js").Message<import("./templates/BaseTextChannel.js").TextChannel>>;
    toJSON(): APIUser;
}
