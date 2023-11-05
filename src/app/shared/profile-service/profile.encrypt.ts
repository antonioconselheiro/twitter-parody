import { Injectable } from '@angular/core';
import { NostrUser } from '@domain/nostr-user';
import { IUnauthenticatedUser } from '@shared/security-service/unauthenticated-user';
import { IProfile } from '@domain/profile.interface';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class ProfileEncrypt {

  private readonly initializationVector = CryptoJS.enc.Hex.parse('be410fea41df7162a679875ec131cf2c');
  private readonly mode = CryptoJS.mode.CBC;
  private readonly padding = CryptoJS.pad.Pkcs7;

  encryptAccount(profile: IProfile, pin?: string): IUnauthenticatedUser | null {
    const nostrSecret = profile.user.nostrSecret;
    const displayName = profile.display_name || profile.name;
    const picture = profile.picture || '/assets/profile/default-profile.jpg';

    if (!nostrSecret || !displayName) {
      return null;
    }

    const nsecEncrypted = CryptoJS.AES.encrypt(nostrSecret, String(pin), {
      iv: this.initializationVector,
      mode: this.mode,
      padding: this.padding
    });

    return {
      picture,
      displayName,
      npub: profile.user.nostrPublic,
      nip05: profile.nip05,
      nip05valid: profile.nip05valid,
      nsecEncrypted: String(nsecEncrypted)
    };
  }

  decryptAccount(account: IUnauthenticatedUser, pin: string): NostrUser {
    const decrypted = CryptoJS.AES.decrypt(account.nsecEncrypted, pin, {
      iv: this.initializationVector,
      mode: this.mode,
      padding: this.padding
    });

    const nsec = CryptoJS.enc.Utf8.stringify(decrypted);
    return new NostrUser(nsec);
  }
}
