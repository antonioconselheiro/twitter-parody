import { Injectable } from '@angular/core';
import { DataLoadType } from '@domain/data-load-type';
import { NostrEventKind } from '@domain/nostr-event-kind';
import { NostrUser } from '@domain/nostr-user';
import { ApiService } from '@shared/api-service/api.service';
import { Event, nip19 } from 'nostr-tools';
import { BehaviorSubject } from 'rxjs';
import { IProfile } from './profile.interface';
import * as CryptoJS from 'crypto-js';
import { IUnauthenticatedUser } from '@shared/security-service/unauthenticated-user';
import { TweetHtmlfyService } from '@shared/tweet-service/tweet-htmlfy.service';

/**
 * Them main observable of this class emit the authenticated profile metadata
 */
@Injectable({
  providedIn: 'root'
})
export class ProfilesObservable extends BehaviorSubject<IProfile | null> {

  static instance: ProfilesObservable | null = null;

  private readonly initializationVector = CryptoJS.enc.Hex.parse('be410fea41df7162a679875ec131cf2c');
  private readonly mode = CryptoJS.mode.CBC;
  private readonly padding = CryptoJS.pad.Pkcs7;

  profiles: {
    [npub: string]: IProfile
  } = {};

  constructor(
    private apiService: ApiService,
    private tweetHtmlfyService: TweetHtmlfyService
  ) {
    const authProfileSerialized = sessionStorage.getItem('ProfilesObservable_auth');
    const authProfile = authProfileSerialized ? JSON.parse(authProfileSerialized) as IProfile : null;

    super(authProfile);

    if (!ProfilesObservable.instance) {
      ProfilesObservable.instance = this;
    }

    return ProfilesObservable.instance;
  }

  cache(profiles: Event<NostrEventKind>[]): void;
  cache(profiles: IProfile[]): void;
  cache(profiles: IProfile[] | Event<NostrEventKind>[]): void {
    const profileList = (profiles as (IProfile | Event<NostrEventKind>)[]);
    profileList
      .filter((profile) => !('sig' in profile && profile.kind !== NostrEventKind.Metadata))
      .forEach(profile => this.cacheProfile(profile));
  }

  async load(npubs: string): Promise<IProfile>;
  async load(npubs: string[]): Promise<IProfile[]>;
  async load(npubs: string[] | string): Promise<IProfile | IProfile[]> {
    if (typeof npubs === 'string') {
      return this.profiles[npubs] || this.loadProfile(npubs);
    } else {
      return this.loadProfiles(npubs);
    }
  }

  private async loadProfiles(npubs: string[]): Promise<IProfile[]> {
    return Promise.all(npubs.map(npub => this.loadProfile(npub)));
  }

  private async loadProfile(npub: string): Promise<IProfile> {
    const profile = this.get(npub);
    if (profile && profile.name) {
      return Promise.resolve(profile);
    }

    const events = await this.apiService.get([
      {
        kinds: [
          NostrEventKind.Metadata
        ],
        authors: [
          String(new NostrUser(npub))
        ]
      }
    ]);

    this.cache(events);
    return Promise.resolve(this.get(npub));
  }

  private cacheProfile(profile: IProfile | Event<NostrEventKind>): IProfile {
    if ('sig' in profile) {
      const metadata = JSON.parse(profile.content);
      const npub = nip19.npubEncode(profile.pubkey);
      const htmlAbout = metadata.about && this.tweetHtmlfyService.safify(metadata.about)

      const newProfile = this.profiles[npub] = {
        npub: npub,
        user: new NostrUser(npub),
        load: DataLoadType.EAGER_LOADED,
        ...metadata
      }

      if (htmlAbout) {
        newProfile.htmlAbout = htmlAbout;
      }

      return newProfile;
    } else {
      return this.profiles[profile.npub] = profile;
    }
  }

  getFromPubKey(pubkey: string): IProfile {
    return this.get(nip19.npubEncode(pubkey));
  }
  
  get(npubs: string): IProfile;
  get(npubs: string[]): IProfile[];
  get(npubs: string[] | string): IProfile | IProfile[] {
    if (typeof npubs === 'string') {
      return this.getOrCreateLazyLoadProfiles(npubs);
    } else {
      return npubs.map(npub => this.getOrCreateLazyLoadProfiles(npub));
    }
  }

  private getOrCreateLazyLoadProfiles(npub: string): IProfile {
    if (this.profiles[npub]) {
      return this.profiles[npub];
    }

    return this.getMetadataFromNostrPublic(npub);
  }

  getAuthProfile(): IProfile | null {
    return this.getValue();
  }

  getMetadataFromNostrPublic(npub: string): IProfile {
    return { npub, user: new NostrUser(npub), load: DataLoadType.LAZY_LOADED };
  }

  encryptAccount(profile: IProfile, pin: string): IUnauthenticatedUser | null {
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

  authenticateAccount(account: IUnauthenticatedUser, pin: string): Promise<IProfile> {
    const decrypted = CryptoJS.AES.decrypt(account.nsecEncrypted, pin, {
      iv: this.initializationVector,
      mode: this.mode,
      padding: this.padding
    });

    const nsec = CryptoJS.enc.Utf8.stringify(decrypted);
    const user = new NostrUser(nsec);

    return this
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
