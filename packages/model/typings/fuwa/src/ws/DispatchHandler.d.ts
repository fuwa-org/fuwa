import { GatewayManager, GatewayShard } from '@fuwa/ws';
import { GatewayDispatchPayload } from 'discord-api-types/v10';
import { Client } from '../client/Client.js';
export declare function handleDispatch(client: Client, manager: GatewayManager, data: GatewayDispatchPayload, shard: GatewayShard): Promise<void>;
