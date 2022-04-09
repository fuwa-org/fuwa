import snakeCase from 'lodash.snakecase';
import { BaseStructure } from '../structures/templates/BaseStructure.js';

/**
 * Utility class to transform values into objects ready to be uploaded to the API.
 */
export class DataTransformer {
  static snakeCase(data: any): any {
    if (typeof data === 'string') return snakeCase(data);
    else if (typeof data !== 'object' || Array.isArray(data))
      return data.map(DataTransformer.snakeCase);

    return Object.fromEntries(
      Object.entries(data).map(([K, V]) => [
        snakeCase(K),
        DataTransformer.snakeCase(V),
      ]),
    );
  }

  static asJSON(data: any): any {
    return BaseStructure.toJSON(data);
  }
}
