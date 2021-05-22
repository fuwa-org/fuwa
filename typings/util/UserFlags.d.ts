import { BitField } from "./BitField";
export declare class UserFlags extends BitField {
    static ALL: number;
    static FLAGS: {
        /** Discord Employee */
        STAFF: number;
        /** Discord Partner */
        PARTNER: number;
        /** Hypesquad Events */
        HYPESQUAD: number;
        /** Bug Hunter Level 1 */
        BUG_HUNTER_LEVEL_1: number;
        /** SMS recovery for 2FA enabled [not public] */
        MFA_SMS: number;
        /** Dismissed Nitro promotion [not public] */
        PREMIUM_PROMO_DISMISSED: number;
        /** Hypesquad Bravery */
        HYPESQUAD_ONLINE_HOUSE_1: number;
        /** Hypesquad Brilliance */
        HYPESQUAD_ONLINE_HOUSE_2: number;
        /** Hypesquad Balance */
        HYPESQUAD_ONLINE_HOUSE_3: number;
        /** Early Supporter */
        PREMIUM_EARLY_SUPPORTER: number;
        /** Team user */
        TEAM_USER: number;
        /** Relates to partnership/verification applications */
        "": number;
        /** System user */
        SYSTEM: number;
        /** Has an unread system message [not public] */
        HAS_UNREAD_URGENT_MESSAGES: number;
        /** Bug Hunter Level 2 */
        BUG_HUNTER_LEVEL_2: number;
        /** Pending deletion for being underage in DOB prompt [not public] */
        UNDERAGE_DELETED: number;
        /** Verified Bot */
        VERIFIED_BOT: number;
        /** Early Verified Bot Developer */
        VERIFIED_DEVELOPER: number;
        /** Discord Certified Moderator */
        CERTIFIED_MODERATOR: number;
    };
}
