import { APIReaction } from 'discord-api-types/v10';
import { BaseStructure } from '../BaseStructure';
import { PartialEmoji } from '../emoji/PartialEmoji';

export class MessageReaction extends BaseStructure<APIReaction> {
  count: number;
  me: boolean;
  emoji: PartialEmoji;

  constructor(data: APIReaction) {
    super(data);

    this.count = data.count ?? 0;
    this.me = !!data.me;
    this.emoji = new PartialEmoji(data.emoji);
  }

  toJSON(): APIReaction {
    return {
      count: this.count,
      me: this.me,
      emoji: this.emoji.toJSON(),
    };
  }
}
