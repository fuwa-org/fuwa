import { GatewayReadyDispatchData, Snowflake, APIApplication } from 'discord-api-types';
import { ApplicationFlags } from '../util/ApplicationFlags';
import { Base } from './Base';
export declare class Application extends Base<APIApplication | Pick<APIApplication, 'id' | 'flags'>> {
    flags: ApplicationFlags;
    /** The application's ID. */
    id: Snowflake;
    /** @internal */
    _patchInitial(data: GatewayReadyDispatchData): void;
}
