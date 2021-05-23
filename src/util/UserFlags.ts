import { BitField } from './BitField';

export class UserFlags extends BitField {
  static ALL = 262143;
  static FLAGS = {
    /** Discord Employee */
    STAFF: 1 << 0,
    /** Discord Partner */
    PARTNER: 1 << 1,
    /** Hypesquad Events */
    HYPESQUAD: 1 << 2,
    /** Bug Hunter Level 1 */
    BUG_HUNTER_LEVEL_1: 1 << 3,
    /** SMS recovery for 2FA enabled [not public] */
    MFA_SMS: 1 << 4,
    /** Dismissed Nitro promotion [not public] */
    PREMIUM_PROMO_DISMISSED: 1 << 5,
    /** Hypesquad Bravery */
    HYPESQUAD_ONLINE_HOUSE_1: 1 << 6,
    /** Hypesquad Brilliance */
    HYPESQUAD_ONLINE_HOUSE_2: 1 << 7,
    /** Hypesquad Balance */
    HYPESQUAD_ONLINE_HOUSE_3: 1 << 8,
    /** Early Supporter */
    PREMIUM_EARLY_SUPPORTER: 1 << 9,
    /** Team user */
    TEAM_USER: 1 << 10,
    /** Relates to partnership/verification applications */
    '': 1 << 11,
    /** System user */
    SYSTEM: 1 << 12,
    /** Has an unread system message [not public] */
    HAS_UNREAD_URGENT_MESSAGES: 1 << 13,
    /** Bug Hunter Level 2 */
    BUG_HUNTER_LEVEL_2: 1 << 14,
    /** Pending deletion for being underage in DOB prompt [not public] */
    UNDERAGE_DELETED: 1 << 15,
    /** Verified Bot */
    VERIFIED_BOT: 1 << 16,
    /** Early Verified Bot Developer */
    VERIFIED_DEVELOPER: 1 << 17,
    /** Discord Certified Moderator */
    CERTIFIED_MODERATOR: 1 << 18,
  };
}
