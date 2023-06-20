import { APITeam, Snowflake } from 'discord-api-types/v10';
import { BaseStructure } from '../BaseStructure';
import { TeamMember } from './TeamMember';

export class Team extends BaseStructure<APITeam> {
  id: Snowflake;
  name: string;
  icon: string | null;

  members: TeamMember[];
  ownerId: Snowflake;

  constructor(data: APITeam) {
    super(data);

    this.id = data.id;
    this.name = data.name;
    this.icon = data.icon;

    this.members = data.members.map(member => new TeamMember(member));
    this.ownerId = data.owner_user_id;
  }

  toJSON(): APITeam {
    return {
      icon: this.icon,
      id: this.id,
      members: this.members.map(member => member.toJSON()),
      name: this.name,
      owner_user_id: this.ownerId,
    };
  }
}
