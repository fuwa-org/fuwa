import { APIMessageReferenceSend, ChannelType, GuildChannelType } from 'discord-api-types/v10';
import { LogLevel } from '../logging/LoggerOptions';
import { File } from '../rest/APIRequest';
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
    static str(value: string | undefined, required?: boolean, nonempty?: boolean): string | undefined;
    static int(value: number | undefined, required?: boolean, min?: number, max?: number): number | undefined;
    static bool(value: boolean | undefined, required?: boolean): boolean | undefined;
    static any(value: any | undefined, cases: [string, any[]][]): any | undefined;
}
