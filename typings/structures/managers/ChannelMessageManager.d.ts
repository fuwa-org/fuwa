import { Message } from "../Message";
import { BaseTextChannel } from "../templates/BaseTextChannel";
import { BaseManager } from "./BaseManager";
export declare class ChannelMessageManager extends BaseManager<Message<BaseTextChannel>> {
    channel: BaseTextChannel;
    constructor(channel: BaseTextChannel);
}
