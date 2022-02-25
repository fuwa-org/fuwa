import { APIGuild } from '@splatterxl/discord-api-types';
import { Guild } from '../structures/Guild.js';
export declare class DataTransformer {
    static snakeCase(data: any): any;
    static guild(data: Partial<Guild | APIGuild>): Partial<APIGuild>;
}
