import { GatewayDispatchPayload } from "discord-api-types/v10";
import { GatewayManager } from "./GatewayManager";
import { GatewayShard } from "./GatewayShard";
export declare function handleDispatch(manager: GatewayManager, data: GatewayDispatchPayload, shard: GatewayShard): void;
