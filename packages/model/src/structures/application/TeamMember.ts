import {
  APITeamMember,
  Snowflake,
  TeamMemberMembershipState,
} from 'discord-api-types/v10';
import { BaseStructure } from '../BaseStructure';
import { User } from '../User';

export class TeamMember extends BaseStructure<APITeamMember> {
  membershipState: TeamMemberMembershipState;
  permissions: ['*'] = ['*'];
  teamId: Snowflake;

  user: User;

  constructor(data: APITeamMember) {
    super(data);

    this.membershipState = data.membership_state;
    this.permissions = data.permissions;
    this.teamId = data.team_id;
    this.user = new User(data.user);
  }

  toJSON(): APITeamMember {
    return {
      membership_state: this.membershipState,
      permissions: this.permissions,
      team_id: this.teamId,
      user: this.user.toJSON(),
    };
  }
}
