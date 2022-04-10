import { ChannelType, GuildChannelType } from 'discord-api-types/v10';
import { resolveIntents } from '../client/ClientOptions';
import { LogLevel } from '../logging/LoggerOptions';
import { File } from '../rest/APIRequest';
import { Intents } from './bitfields/Intents';
import { FuwaError } from './errors';
import { resolveFile, toDataURI, toFile } from './resolvables/FileResolvable';

export class DataResolver {
  static LOG_LEVELS = ['info', 'warn', 'error', 'debug', 'trace'] as const;

  static channelType(type: ChannelType): ChannelType {
    const resolved = ChannelType[type];

    if (resolved === undefined)
      throw new FuwaError('INVALID_PARAMETER', 'type', 'a valid channel type');

    if (typeof resolved === 'string') {
      return type;
    }

    return resolved;
  }

  static guildChannelType(type: GuildChannelType): GuildChannelType {
    if ([ChannelType.DM, ChannelType.GroupDM, 'DM', 'GroupDM'].includes(type))
      throw new FuwaError(
        'INVALID_PARAMETER',
        'type',
        'a valid guild channel type',
      );

    return this.channelType(type) as GuildChannelType;
  }

  static async dataURI(file: string): Promise<string> {
    const resolved = await resolveFile(file);
    return toDataURI(resolved);
  }

  static async file(file: string): Promise<File> {
    const resolved = await resolveFile(file);
    return toFile(resolved);
  }

  static intents(intents: number | Intents): Intents {
    return resolveIntents(intents);
  }

  static logLevel(level: LogLevel): LogLevel[] {
    if (!this.LOG_LEVELS.includes(level))
      throw new FuwaError('INVALID_PARAMETER', 'level', 'a valid log level');

    // remove all elements of this.LOG_LEVELS that are after the given level
    return this.LOG_LEVELS.slice(0, this.LOG_LEVELS.indexOf(level) + 1);
  }
}
