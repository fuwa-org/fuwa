import { APIGuild } from '@splatterxl/discord-api-types';
import snakeCase from 'lodash.snakecase';
import { Guild } from '../structures/Guild.js';

/**
 * Utility class to transform values into objects ready to be uploaded to the API.
 */
export class DataTransformer {
  static snakeCase(data: any): any {
    if (typeof data !== 'object') return data;

    return Object.fromEntries(
      Object.entries(data).map(([K, V]) => [
        snakeCase(K),
        DataTransformer.snakeCase(V),
      ])
    );
  }

  static guild(data: Partial<Guild | APIGuild>): Partial<APIGuild> {
    return DataTransformer.snakeCase(data);
  }
}
