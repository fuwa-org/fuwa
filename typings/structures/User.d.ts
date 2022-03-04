import { APIUser } from '@splatterxl/discord-api-types';
import { UserFlags } from '../util/bitfields/UserFlags.js';
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
    _deserialise(data: APIUser): this;
    toString(): string;
    fetch(): Promise<this>;
}
