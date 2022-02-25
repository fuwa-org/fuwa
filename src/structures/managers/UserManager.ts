import { ClientUser } from '../ClientUser.js';
import { User } from '../User.js';
import { BaseManager } from './BaseManager.js';

export class UserManager extends BaseManager<ClientUser | User> {}
