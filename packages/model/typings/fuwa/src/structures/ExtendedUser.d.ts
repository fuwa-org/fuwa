import { APIUser, Locale } from 'discord-api-types/v10';
import { FileResolvable } from '../util/resolvables/FileResolvable.js';
import { User } from './User.js';
export declare class ExtendedUser extends User {
    email: string | null;
    emailVerified: boolean | null;
    mfaEnabled: boolean | null;
    locale: Locale | null;
    _deserialise(data: APIUser): this;
    edit(data: Partial<Pick<APIUser, 'username' | 'avatar'>>): Promise<this>;
    setUsername(username: string): Promise<this>;
    setAvatar(avatar: FileResolvable | null): Promise<this>;
    toJSON(): APIUser;
}
