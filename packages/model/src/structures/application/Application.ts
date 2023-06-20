import {
  APIApplication,
  ApplicationFlags,
  OAuth2Scopes,
  Permissions,
  Snowflake,
} from 'discord-api-types/v10';
import { Constants } from '../../constants';
import { BaseStructure } from '../BaseStructure';
import { User } from '../User';
import { ApplicationInstallParams } from './ApplicationInstallParams';
import { Team } from './Team';

export class Application extends BaseStructure<APIApplication> {
  id: Snowflake;
  flags: ApplicationFlags;

  name: string;
  icon: string | null;
  description: string;
  tags: [string?, string?, string?, string?, string?] = [];

  rpcOrigins: string[] = [];
  botPublic = true;
  botRequireCodeGrant = false;

  termsOfServiceURL: string | null;
  privacyPolicyURL: string | null;

  owner: User | null;
  team: Team | null;

  /**
   * @deprecated This field will be removed in API v11
   */
  summary = '';

  verifyKey: string;
  roleConnectionsVerificationURL: string | null;

  guildId: Snowflake | null;
  installParams: ApplicationInstallParams;
  customInstallURL: string | null;

  primarySKUId: Snowflake | null;
  slug: string | null;
  coverImage: string | null;

  getInstallURL(
    options: { scopes?: OAuth2Scopes[]; permissions?: Permissions } = {},
  ) {
    return Constants.ApplicationInstallUrl(
      this.installParams.toString(options),
    );
  }

  constructor(data: APIApplication) {
    super(data);

    this.id = data.id;
    this.flags = data.flags ?? 0;

    this.name = data.name;
    this.icon = data.icon ?? null;
    this.description = data.description ?? '';
    this.tags = data.tags ?? [];

    this.rpcOrigins = data.rpc_origins ?? [];
    this.botPublic = data.bot_public ?? true;
    this.botRequireCodeGrant = data.bot_require_code_grant ?? false;

    this.termsOfServiceURL = data.terms_of_service_url ?? null;
    this.privacyPolicyURL = data.privacy_policy_url ?? null;

    this.owner = data.owner ? new User(data.owner) : null;
    this.team = data.team ? new Team(data.team) : null;

    this.verifyKey = data.verify_key;
    this.roleConnectionsVerificationURL =
      data.role_connections_verification_url ?? null;

    this.guildId = data.guild_id ?? null;
    this.installParams = new ApplicationInstallParams(data.install_params);
    this.customInstallURL = data.custom_install_url ?? null;

    this.primarySKUId = data.primary_sku_id ?? null;
    this.slug = data.slug ?? null;
    this.coverImage = data.cover_image ?? null;
  }

  toJSON(): APIApplication {
    return {
      id: this.id,
      flags: this.flags,
      name: this.name,
      icon: this.icon,
      description: this.description,
      summary: '',
      tags: this.tags.length
        ? (this.tags as [string, string?, string?, string?, string?])
        : undefined,
      rpc_origins: this.rpcOrigins,
      bot_public: this.botPublic,
      bot_require_code_grant: this.botRequireCodeGrant,
      terms_of_service_url: this.termsOfServiceURL ?? undefined,
      privacy_policy_url: this.privacyPolicyURL ?? undefined,
      owner: this.owner ? this.owner.toJSON() : undefined,
      team: this.team ? this.team.toJSON() : null,
      verify_key: this.verifyKey,
      role_connections_verification_url:
        this.roleConnectionsVerificationURL ?? undefined,
      guild_id: this.guildId ?? undefined,
      install_params: this.installParams.toJSON(),
      custom_install_url: this.customInstallURL ?? undefined,
      primary_sku_id: this.primarySKUId ?? undefined,
    };
  }
}
