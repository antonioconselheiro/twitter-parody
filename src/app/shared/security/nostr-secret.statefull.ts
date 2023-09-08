import { Injectable } from '@angular/core';
import { IProfile } from '@shared/profile-service/profile.interface';
import { LocalStorage } from '@shared/storage/localstorage.decorator';
import { AES } from 'crypto-js';
import { IUnauthenticatedUser } from './unauthenticated-user';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class NostrSecretStatefull {

  //@LocalStorage()
  accounts: IUnauthenticatedUser[] = [];

  static instance: NostrSecretStatefull | null = null;

  constructor() {
    if (!NostrSecretStatefull.instance) {
      NostrSecretStatefull.instance = this;
    }

    return NostrSecretStatefull.instance;
  }

  private accountsSubject = new BehaviorSubject<IUnauthenticatedUser[]>(this.accounts);
  accounts$ = this.accountsSubject.asObservable();

  // eslint-disable-next-line complexity
  addAccount(profile: IProfile, pin: string): void {
    const nostrSecret = profile.user.nostrSecret;
    const displayName = profile.display_name || profile.name;
    const picture = profile.picture || '/assets/profile/default-banner.jpg';

    if (!nostrSecret || !displayName) {
      return;
    }

    const nsecEncrypted = AES.encrypt(nostrSecret, String(pin));
    const unauthenticated: IUnauthenticatedUser = {
      picture,
      displayName,
      npub: profile.user.nostrPublic,
      nip05: profile.nip05,
      nip05valid: profile.nip05valid,
      nsecEncrypted: String(nsecEncrypted)
    };

    this.accounts = [unauthenticated].concat(this.accounts).filter(a => a);
    this.accountsSubject.next(this.accounts);
  }
}
