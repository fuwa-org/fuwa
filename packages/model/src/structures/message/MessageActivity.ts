import { APIMessageActivity, MessageActivityType } from 'discord-api-types/v10';
import { BaseStructure } from '../BaseStructure';

export class MessageActivity extends BaseStructure<APIMessageActivity> {
  type: MessageActivityType;
  partyId: string | null;

  constructor(data: APIMessageActivity) {
    super(data);

    this.type = data.type;
    this.partyId = data.party_id ?? null;
  }

  toJSON(): APIMessageActivity {
    return {
      type: this.type,
      party_id: this.partyId ?? undefined,
    };
  }
}
