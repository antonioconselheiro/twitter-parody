import { Injectable } from "@angular/core";
import { IProfile } from "../../domain/profile.interface";
import { ProfileConverter } from "./profile.converter";
import { ProfileCache } from "./profile.cache";
import { ProfileApi } from "./profile.api";
import { Event } from 'nostr-tools';
import { NostrEventKind } from "@domain/nostr-event-kind.enum";
import { DataLoadType } from "@domain/data-load.type";
import { TNostrPublic } from "@domain/nostr-public.type";

/**
 * Orchestrate the interaction with the profile data,
 * check the cache, call the nostr api, cast the
 * resultset into domain object, cache it and return
 * 
 * There is a set of operations that must be done for
 * each nostr query precisely to reduce the need to repeat
 * queries, the complexity of this flow is abstracted
 * through this facade, which orchestrates services with
 * different responsibilities (cache, api, cast)
 */
@Injectable()
export class ProfileProxy {

  constructor(
    private profileApi: ProfileApi,
    private profileCache: ProfileCache,
    private profileConverter: ProfileConverter
  ) { }

  get(npubs: string): IProfile;
  get(npubs: string[]): IProfile[];
  get(npubs: string[] | string): IProfile | IProfile[];
  get(npubs: string[] | string): IProfile | IProfile[] {
    return this.profileCache.get(npubs);
  }

  cache(profiles: IProfile[]): void;
  cache(profiles: Event<NostrEventKind>[]): void;
  cache(profiles: IProfile[] | Event<NostrEventKind>[]): void;
  cache(profiles: IProfile[] | Event<NostrEventKind>[]): void {
    this.profileCache.cache(profiles);
  }

  async load(npubs: string): Promise<IProfile>;
  async load(npubs: string[]): Promise<IProfile[]>;
  async load(npubs: string[] | string): Promise<IProfile | IProfile[]> {
    if (typeof npubs === 'string') {
      const indexedProfile = ProfileCache.profiles[npubs];
      if (!indexedProfile || indexedProfile.load === DataLoadType.LAZY_LOADED) {
        return this.loadProfile(npubs);
      }

      return Promise.resolve(indexedProfile);
    } else {
      return this.loadProfiles(npubs);
    }
  }

  loadFromPubKey(pubkey: string): Promise<IProfile> {
    return this.loadProfile(this.profileConverter.castPubkeyToNostrPublic(pubkey));
  }

  async loadProfiles(...npubss: TNostrPublic[][]): Promise<IProfile[]> {
    const npubs = [...new Set(npubss.flat(1))];

    const notLoaded = npubs.filter(npub => !this.profileCache.isEagerLoaded(npub))

    return this.forceProfileReload(notLoaded);
  }

  async loadProfile(npub: string): Promise<IProfile> {
    return this.loadProfiles([npub])
      .then(npubs => Promise.resolve(npubs[0]));
  }
  
  private async forceProfileReload(npubs: Array<TNostrPublic>): Promise<Array<IProfile>> {
    const events = await this.profileApi.loadProfiles(npubs);
    this.profileCache.cache(events);
    return Promise.resolve(npubs.map(npub => this.profileCache.get(npub)));
  }
}
