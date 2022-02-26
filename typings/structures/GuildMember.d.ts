import { APIGuildMember } from '@splatterxl/discord-api-types';
import { Guild } from './Guild.js';
import { BaseStructure } from './templates/BaseStructure.js';
import { User } from './User.js';
export declare class GuildMember extends BaseStructure<APIGuildMember> {
    guild: Guild;
    user: User | null;
    nickname: string | null;
    constructor(guild: Guild);
    _deserialise(_data: APIGuildMember): this;
    _patch(data: APIGuildMember, guild?: Guild, user?: User): this;
}
