import { Injectable } from '@angular/core';
import { IProfile } from '@domain/profile.interface';
import { IUnauthenticatedUser } from '@shared/security-service/unauthenticated-user';
import { BehaviorSubject } from 'rxjs';
import { ProfileEncrypt } from './profile.encrypt';
import { ProfileProxy } from './profile.proxy';

/**
 * This class responsible for caching event information
 * involving profiles, including events: Metadata (0)
 * 
 * Them main observable of this class emit the authenticated
 * profile metadata
 */
@Injectable({
  providedIn: 'root'
})
export class AuthenticatedProfileObservable extends BehaviorSubject<IProfile | null> {

  static instance: AuthenticatedProfileObservable | null = null;

  constructor(
    private profileProxy: ProfileProxy,
    private profileEncrypt: ProfileEncrypt
  ) {
    const authProfileSerialized = sessionStorage.getItem('ProfilesObservable_auth');
    const authProfile = authProfileSerialized ? JSON.parse(authProfileSerialized) as IProfile : null;

    super(authProfile);

    if (!AuthenticatedProfileObservable.instance) {
      AuthenticatedProfileObservable.instance = this;
    }

    return AuthenticatedProfileObservable.instance;
  }

  getAuthProfile(): IProfile | null {
    return this.getValue();
  }

  authenticateAccount(account: IUnauthenticatedUser, pin: string): Promise<IProfile> {
    const user = this.profileEncrypt.decryptAccount(account, pin);

    return this.profileProxy
      .load(user.nostrPublic)
      .then(profile => {
        const authProfile = { ...profile, ...{ user } };
        this.next(authProfile);
        sessionStorage.setItem('ProfilesObservable_auth', JSON.stringify(authProfile));
        return Promise.resolve(authProfile);
      });
  }

  logout(): void {
    this.next(null);
    sessionStorage.clear();
  }
}
