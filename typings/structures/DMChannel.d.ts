import { APIDMChannel } from 'discord-api-types/v10';
import { BaseTextChannel } from './templates/BaseTextChannel.js';
import { User } from './User.js';
export declare class DMChannel extends BaseTextChannel {
    recipient: User;
    _deserialise(data: APIDMChannel): this;
    toJSON(): APIDMChannel;
}
