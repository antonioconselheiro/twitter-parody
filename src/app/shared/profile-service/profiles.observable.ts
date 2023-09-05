import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { IProfile } from './profile.interface';
import { Event, nip19 } from 'nostr-tools';
import { NostrUser } from '@domain/nostr-user';
import { NostrEventKind } from '@domain/nostr-event-kind';
import { ApiService } from '@shared/api-service/api.service';

/**
 * O observable principal da classe emite os metadados do perfil autenticado
 */
@Injectable({
  providedIn: 'root'
})
export class ProfilesObservable extends BehaviorSubject<IProfile | null> {

  static instance: ProfilesObservable | null = null;

  profiles: {
    [npub: string]: IProfile
  } = {};

  constructor(
    private apiService: ApiService
  ) {
    const npub = 'npub1lafcm7zm35l9q06mnaqk5ykt2530ylnwm5j8xaykflppfstv6vysxg4ryf';

    super({ npub, user: new NostrUser(npub) });

    if (!ProfilesObservable.instance) {
      ProfilesObservable.instance = this;
    }

    return ProfilesObservable.instance;
  }

  cache(profiles: Event<NostrEventKind>[]): void;
  cache(profiles: IProfile[]): void;
  cache(profiles: IProfile[] | Event<NostrEventKind>[]): void {
    const profileList = (profiles as (IProfile | Event<NostrEventKind.Metadata>)[]);
    profileList.filter(profile => {
      if ('sig' in profile && profile.kind != NostrEventKind.Metadata) {
        return false;
      }

      return true;
    }).forEach(profile => {
      const cachedProfile = this.cacheProfile(profile);
      this.profiles[cachedProfile.npub] = cachedProfile;
    });
  }

  async load(npubs: string): Promise<IProfile>;
  async load(npubs: string[]): Promise<IProfile[]>;
  async load(npubs: string[] | string): Promise<IProfile | IProfile[]> {
    if (typeof npubs == 'string') {
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
      return {
        npub: profile.pubkey,
        user: new NostrUser(profile.pubkey),
        ...JSON.parse(profile.content)
      }
    } else {
      //  TODO: validar se não estão incompletos para que sejam carregados em paralelo
      return profile;
    }
  }

  getFromPubKey(pubkey: string): IProfile {
    return this.get(nip19.npubEncode(pubkey));
  }
  
  get(npubs: string): IProfile;
  get(npubs: string[]): IProfile[];
  get(npubs: string[] | string): IProfile | IProfile[] {
    //  TODO: incluir rotina para complementar com mais informações profiles vazios 
    if (typeof npubs == 'string') {
      return this.profiles[npubs];
    } else {
      return npubs.map(npub => this.profiles[npub]);
    }
  }

  setAuthProfile(npub: string): void {
    this.next(this.get(npub));
  }

  getAuthProfile(): Observable<IProfile | null> {
    return this;
  }

  getMetadataFromNostrPublic(npub: string): IProfile {
    return { npub, user: new NostrUser(npub) };
  }
}
