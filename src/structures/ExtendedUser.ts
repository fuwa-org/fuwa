import { APIUser, Locale, Routes } from '@splatterxl/discord-api-types';
import { UserFlags } from '../util/bitfields/UserFlags.js';
import {
  FileResolvable,
  resolveFile,
  toDataURI,
} from '../util/resolvables/FileResolvable.js';
import { User } from './User.js';

export class ExtendedUser extends User {
  public email: string | null = null;
  public emailVerified: boolean | null = null;
  public mfaEnabled: boolean | null = null;
  public locale: Locale | null = null;

  public _deserialise(data: APIUser): this {
    super._deserialise(data);

    if ('email' in data) this.email = data.email!;
    if ('mfa_enabled' in data) this.mfaEnabled = data.mfa_enabled!;
    if ('verified' in data) this.emailVerified = data.verified!;
    if ('locale' in data) this.locale = data.locale! as Locale;
    if ('flags' in data) this.flags = new UserFlags(data.flags!);

    return this;
  }

  public edit(data: Partial<Pick<APIUser, 'username' | 'avatar'>>) {
    return this.client.http
      .queue({ route: Routes.user('@me'), method: 'PATCH', body: data })
      .then(async (res) => {
        this._deserialise(await res.body.json());
        return this;
      });
  }

  public setUsername(username: string) {
    return this.edit({ username });
  }

  public async setAvatar(avatar: FileResolvable | null) {
    return this.edit({
      avatar: avatar ? toDataURI(await resolveFile(avatar)) : null,
    });
  }

  toJSON(): APIUser {
    return {
      ...super.toJSON(),
      email: this.email,
      mfa_enabled: !!this.mfaEnabled,
      verified: !!this.emailVerified,
      locale: this.locale ?? undefined,
    };
  }
}
