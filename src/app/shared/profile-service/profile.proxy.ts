import { Injectable } from "@angular/core";
import { IProfile } from "../../domain/profile.interface";
import { ProfileConverter } from "./profile.converter";
import { ProfileCache } from "./profile.cache";
import { ProfileApi } from "./profile.api";
import { Event } from 'nostr-tools';
import { NostrEventKind } from "@domain/nostr-event-kind";
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

  async loadProfiles(npubs: string[]): Promise<IProfile[]> {
    return Promise.all(npubs.map(npub => this.loadProfile(npub)));
  }

  async loadProfile(npub: string): Promise<IProfile> {
    const profile = this.profileCache.get(npub);
    if (profile && profile.load === DataLoadType.EAGER_LOADED) {
      return Promise.resolve(profile);
    }

    return this.forceProfileReload(npub);
  }
  
  private async forceProfileReload(npub: TNostrPublic): Promise<IProfile> {
    const events = await this.profileApi.loadProfile(npub);
    this.profileCache.cache(events);
    return Promise.resolve(this.profileCache.get(npub));
  }
}
