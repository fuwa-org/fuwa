import { ChannelType, GuildChannelType } from 'discord-api-types/v10';
import { LogLevel } from '../logging/LoggerOptions';
import { File } from '../rest/APIRequest';
import { Intents } from './bitfields/Intents';
export declare class DataResolver {
    static LOG_LEVELS: readonly ["info", "warn", "error", "debug", "trace"];
    static channelType(type: ChannelType): ChannelType;
    static guildChannelType(type: GuildChannelType): GuildChannelType;
    static dataURI(file: string): Promise<string>;
    static file(file: string): Promise<File>;
    static intents(intents: number | Intents): Intents;
    static logLevel(level: LogLevel): LogLevel[];
}
