import { Injectable } from '@angular/core';
import { IProfile } from '@shared/profile-service/profile.interface';
import * as CryptoJS from 'crypto-js';
import { BehaviorSubject } from 'rxjs';
import { IUnauthenticatedUser } from './unauthenticated-user';

@Injectable()
export class NostrSecretStatefull {

  accounts: {
    [npub: string]: IUnauthenticatedUser
  } = JSON.parse(localStorage.getItem('NostrSecretStatefull_accounts') || '{}');

  static instance: NostrSecretStatefull | null = null;

  constructor() {
    if (!NostrSecretStatefull.instance) {
      NostrSecretStatefull.instance = this;
    }

    return NostrSecretStatefull.instance;
  }

  private accountsSubject = new BehaviorSubject<IUnauthenticatedUser[]>(Object.values(this.accounts));
  accounts$ = this.accountsSubject.asObservable();

  // eslint-disable-next-line complexity
  addAccount(profile: IProfile, pin: string): IUnauthenticatedUser | null {
    const nostrSecret = profile.user.nostrSecret;
    const displayName = profile.display_name || profile.name;
    const picture = profile.picture || '/assets/profile/default-profile.jpg';

    if (!nostrSecret || !displayName) {
      return null;
    }

    const nsecEncrypted = CryptoJS.AES.encrypt(nostrSecret, String(pin), {
      iv: CryptoJS.enc.Hex.parse('be410fea41df7162a679875ec131cf2c'),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    const unauthenticated: IUnauthenticatedUser = {
      picture,
      displayName,
      npub: profile.user.nostrPublic,
      nip05: profile.nip05,
      nip05valid: profile.nip05valid,
      nsecEncrypted: String(nsecEncrypted)
    };

    this.accounts[unauthenticated.npub] = unauthenticated;
    this.update();
    return unauthenticated;
  }

  removeAccount(profile: IUnauthenticatedUser): void {
    delete this.accounts[profile.npub];
    this.update();
  }
  
  private update(): void {
    //  FIXME: criar um mecanismo que persita dados
    //  automaticamente em localStorage ou no storage local
    localStorage.setItem('NostrSecretStatefull_accounts', JSON.stringify(this.accounts))
    this.accountsSubject.next(Object.values(this.accounts));
  }
}
