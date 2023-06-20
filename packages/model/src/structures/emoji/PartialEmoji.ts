import { APIPartialEmoji, Snowflake } from 'discord-api-types/v10';
import { BaseStructure } from '../BaseStructure';

export class PartialEmoji extends BaseStructure<APIPartialEmoji> {
  id: Snowflake | null;
  name: string | null;
  animated: boolean;

  toString() {
    return `<${this.animated ? 'a' : ''}:${this.name ?? '_'}:${this.id}>`;
  }

  constructor(data: APIPartialEmoji) {
    super(data);

    this.id = data.id;
    this.name = data.name ?? null;
    this.animated = !!data.animated;
  }

  toJSON(): APIPartialEmoji {
    return {
      id: this.id,
      name: this.name,
      animated: this.animated,
    };
  }
}
