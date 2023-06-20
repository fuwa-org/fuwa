import { APIGuild, APIMessageReferenceSend, ChannelType, GuildChannelType } from 'discord-api-types/v10';
import { LogLevel } from '../logging/LoggerOptions';
import { File } from '@fuwa/rest';
import { Intents } from './bitfields/Intents';
import { MessagePayloadReference } from './resolvables/MessagePayload';
export declare class DataResolver {
    static LOG_LEVELS: readonly ["info", "warn", "error", "debug", "trace"];
    static channelType(type: ChannelType): ChannelType;
    static guildChannelType(type: GuildChannelType): GuildChannelType;
    static dataURI(file: string): Promise<string>;
    static file(file: string): Promise<File>;
    static intents(intents: number | Intents): Intents;
    static logLevel(level: LogLevel): LogLevel[];
    static messageReference(ref?: MessagePayloadReference): APIMessageReferenceSend | undefined;
    static guild(data: Partial<APIGuild>): APIGuild;
    static str<T extends boolean>(value: string | null | undefined, required: T, nonempty?: boolean, name?: string): T extends false ? string | undefined : string;
    static int(value: number | undefined, required?: boolean, min?: number, max?: number): number | undefined;
    static bool(value: boolean | undefined, required?: boolean): boolean | undefined;
    static any(value: any | undefined, cases: [string, any[]][]): any | undefined;
}
