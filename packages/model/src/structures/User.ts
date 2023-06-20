import { APIUser } from 'discord-api-types/v10';
import { BaseStructure } from './BaseStructure';

export class User extends BaseStructure<APIUser> {
  constructor(data: APIUser) {}
}
