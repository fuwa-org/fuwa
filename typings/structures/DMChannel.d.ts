import { APIDMChannel } from '@splatterxl/discord-api-types';
import { BaseTextChannel } from './templates/BaseTextChannel.js';
import { User } from './User.js';
export declare class DMChannel extends BaseTextChannel {
    recipient: User;
    _deserialise(data: APIDMChannel): this;
    toJSON(): APIDMChannel;
}
