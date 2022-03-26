import { GatewayReceivePayload } from '@splatterxl/discord-api-types';
import { GatewayManager } from './GatewayManager.js';
import { GatewayShard } from './GatewayShard.js';
export declare function PacketHandler(this: GatewayManager, shard: GatewayShard, data: GatewayReceivePayload): void;
