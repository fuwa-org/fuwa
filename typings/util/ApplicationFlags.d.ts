import { BitField } from './BitField';
export declare class ApplicationFlags extends BitField {
    FLAGS: {
        readonly MANAGED_EMOJI: 4;
        readonly GROUP_DM_CREATE: 16;
        readonly RPC_HAS_CONNECTED: 2048;
        readonly GATEWAY_PRESENCE: 4096;
        readonly GATEWAY_PRESENCE_LIMITED: 8192;
        readonly GATEWAY_GUILD_MEMBERS: 16384;
        readonly GATEWAY_GUILD_MEMBERS_LIMITED: 32768;
        readonly VERIFICATION_PENDING_GUILD_LIMIT: 65536;
        readonly EMBEDDED: 131072;
    };
}
