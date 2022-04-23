import {
  APIGuild,
  APIMessageReferenceSend,
  ChannelType,
  GuildChannelType,
} from 'discord-api-types/v10';
import { resolveIntents } from '../client/ClientOptions';
import { LogLevel } from '../logging/LoggerOptions';
import { File } from '../rest/APIRequest';
import { Intents } from './bitfields/Intents';
import { FuwaError } from './errors';
import { resolveFile, toDataURI, toFile } from './resolvables/FileResolvable';
import { MessagePayloadReference } from './resolvables/MessagePayload';

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

  static messageReference(
    ref?: MessagePayloadReference,
  ): APIMessageReferenceSend | undefined {
    if (ref === undefined || ref === null) return undefined;

    if (typeof ref === 'string')
      return {
        message_id: ref,
      };
    else {
      return {
        message_id: this.str(ref.message, true)!,
        channel_id: this.str(ref.channel, false),
        guild_id: this.str(ref.guild, false),
      };
    }
  }

  static guild(data: Partial<APIGuild>): APIGuild {
    if (typeof data !== 'object')
      throw new FuwaError(
        'INVALID_PARAMETER',
        'data',
        'a guild object',
      ).setError(new TypeError());

    this.str(data.id, true, true);
    this.str(data.name, true, true);

    return data as APIGuild;
  }

  /// --- VALIDATORS --- ///
  static str<T extends boolean>(
    value: string | null | undefined,
    required: T,
    nonempty = false,
    name = 'value',
  ): T extends false ? string | undefined : string {
    if (value === undefined || value === null) {
      if (required)
        throw new FuwaError('INVALID_PARAMETER', name, 'a string').setError(
          new TypeError(),
        );
      // @ts-ignore
      else return undefined;
    }

    if (typeof value !== 'string')
      throw new FuwaError('INVALID_PARAMETER', name, 'a string').setError(
        new TypeError(),
      );

    if (nonempty && value.length === 0) {
      throw new FuwaError(
        'INVALID_PARAMETER',
        name,
        'a non-empty string',
      ).setError(new TypeError());
    }

    return value;
  }

  static int(
    value: number | undefined,
    required = true,
    min = 0,
    max = Infinity,
  ): number | undefined {
    if (value === undefined || value === null) {
      if (required)
        throw new FuwaError(
          'INVALID_PARAMETER',
          'value',
          'an integer',
        ).setError(new TypeError());
      else return undefined;
    }

    if (typeof value !== 'number')
      throw new FuwaError('INVALID_PARAMETER', 'value', 'an integer').setError(
        new TypeError(),
      );

    if (value < min || value > max)
      throw new FuwaError(
        'INVALID_PARAMETER',
        'value',
        'an integer between ' + min + ' and ' + max,
      ).setError(new RangeError());

    return value;
  }

  static bool(
    value: boolean | undefined,
    required = true,
  ): boolean | undefined {
    if (value === undefined || value === null) {
      if (required)
        throw new FuwaError('INVALID_PARAMETER', 'value', 'a boolean').setError(
          new TypeError(),
        );
      else return undefined;
    }

    if (typeof value !== 'boolean')
      throw new FuwaError('INVALID_PARAMETER', 'value', 'a boolean').setError(
        new TypeError(),
      );

    return value;
  }

  static any(
    value: any | undefined,
    cases: [string, any[]][],
  ): any | undefined {
    let failed = 0;

    for (const [name, args = []] of cases) {
      try {
        // """type safe"""
        (
          this[name as unknown as keyof DataResolver] as (...args: any[]) => any
        )(value, ...args);
      } catch {
        failed++;
      }
    }

    if (failed === cases.length) {
      throw new FuwaError(
        'INVALID_PARAMETER',
        'value',
        `a valid value, one of: ${cases.map(([name]) => name).join(', ')}`,
      ).setError(new TypeError());
    }

    return value;
  }
}
