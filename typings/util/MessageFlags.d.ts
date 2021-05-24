import { BitField } from './BitField';
/** Flags on a {@link Message} */
export declare class MessageFlags extends BitField {
    static FLAGS: {
        /**
         * This message has been published to subscribed channels (via Channel Following)
         */
        CROSSPOSTED: number;
        /**
         * This message originated from a message in another channel (via Channel Following)
         */
        IS_CROSSPOST: number;
        /**
         * Do not include any embeds when serializing this message
         */
        SUPPRESS_EMBEDS: number;
        /**
         * The source message for this crosspost has been deleted (via Channel Following)
         */
        SOURCE_MESSAGE_DELETED: number;
        /**
         * This message came from the urgent message system
         */
        URGENT: number;
        /**
         * This message is only visible to the user who invoked the Interaction
         */
        EPHEMERAL: number;
        /**
         * This message is an Interaction Response and the bot is "thinking"
         */
        LOADING: number;
    };
}
