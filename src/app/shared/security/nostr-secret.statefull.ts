import { Injectable } from '@angular/core';
import { IProfile } from '@shared/profile-service/profile.interface';
import { LocalStorage } from '@shared/storage/localstorage.decorator';
import { AES } from 'crypto-js';
import { IUnauthenticatedUser } from './unauthenticated-user';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class NostrSecretStatefull {

  @LocalStorage()
  accounts: IUnauthenticatedUser[] = [];

  static instance: NostrSecretStatefull | null = null;

  constructor() {
    if (!NostrSecretStatefull.instance) {
      NostrSecretStatefull.instance = this;
    }

    return NostrSecretStatefull.instance;
  }

  accounts$ = new BehaviorSubject<IUnauthenticatedUser[]>(this.accounts);

  // eslint-disable-next-line complexity
  addAccount(profile: IProfile, pin: number): void {
    const nostrSecret = profile.user.nostrSecret;
    const displayName = profile.display_name || profile.name;

    if (!nostrSecret || !displayName || !profile.picture || !profile.user.nostrSecret) {
      return;
    }

    const t = AES.encrypt(profile.user.nostrSecret, String(pin));
debugger;
    const unauthenticated: IUnauthenticatedUser = {
      displayName,
      npub: profile.user.nostrPublic,
      picture: profile.picture,
      nip05: profile.nip05,
      nip05valid: profile.nip05valid,
      nsecEncrypted: ''
    };

    this.accounts.push(unauthenticated);
    this.accounts$.next(this.accounts);
  }
}
