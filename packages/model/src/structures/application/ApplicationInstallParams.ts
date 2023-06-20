import {
  APIApplicationInstallParams,
  OAuth2Scopes,
  Permissions,
} from 'discord-api-types/v10';
import { BaseStructure } from '../BaseStructure';

export class ApplicationInstallParams extends BaseStructure<APIApplicationInstallParams> {
  scopes: OAuth2Scopes[] = [];
  permissions: Permissions = '0';

  constructor(data: APIApplicationInstallParams | undefined) {
    super(data);

    this.scopes = data?.scopes ?? [];
    this.permissions = data?.permissions ?? '0';
  }

  toJSON(): APIApplicationInstallParams {
    return {
      scopes: this.scopes,
      permissions: this.permissions,
    };
  }

  toString(
    options: { scopes?: OAuth2Scopes[]; permissions?: Permissions } = {},
  ): string {
    return new URLSearchParams({
      scopes: (options?.scopes ?? this.scopes).join(' '),
      permissions: (options?.permissions ?? this.permissions).toString(),
    }).toString();
  }
}
