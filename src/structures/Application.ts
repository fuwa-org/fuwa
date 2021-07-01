import {
  GatewayReadyDispatchData,
  Snowflake,
  APIApplication,
} from 'discord-api-types';
import { ApplicationFlags } from '../util/ApplicationFlags';
import { Base } from './Base';

export class Application extends Base<
  APIApplication | Pick<APIApplication, 'id' | 'flags'>
> {
  flags: ApplicationFlags;
  /** The application's ID. */
  id: Snowflake;
  /** @internal */
  _patchInitial(data: GatewayReadyDispatchData): void {
    if ('id' in data.application) this.id = data.application.id;
    if ('flags' in data.application)
      this.flags = new ApplicationFlags(data.application.flags);
  }
}
