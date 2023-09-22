import { Injectable } from "@angular/core";
import { IProfile } from "../../domain/profile.interface";
import { ProfileConverter } from "./profile.converter";
import { ProfileCache } from "./profile.cache";
import { ProfileApi } from "./profile.api";

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
 * 
 * https://refactoring.guru/design-patterns/facade
 */
@Injectable()
export class ProfileProxy {

  constructor(
    private api: ProfileApi,
    private cache: ProfileCache,
    private converter: ProfileConverter
  ) { }

  async load(npubs: string): Promise<IProfile>;
  async load(npubs: string[]): Promise<IProfile[]>;
  async load(npubs: string[] | string): Promise<IProfile | IProfile[]> {
    if (typeof npubs === 'string') {
      return ProfileCache.profiles[npubs] && Promise.resolve(ProfileCache.profiles[npubs]) || this.loadProfile(npubs);
    } else {
      return this.loadProfiles(npubs);
    }
  }

  loadFromPubKey(pubkey: string): Promise<IProfile> {
    return this.loadProfile(this.converter.castPubkeyToNostrPublic(pubkey));
  }

  async loadProfiles(npubs: string[]): Promise<IProfile[]> {
    return Promise.all(npubs.map(npub => this.loadProfile(npub)));
  }

  async loadProfile(npub: string): Promise<IProfile> {
    const profile = this.cache.get(npub);
    if (profile && profile.name) {
      return Promise.resolve(profile);
    }

    const events = await this.api.loadProfile(npub);
    this.cache.cache(events);
    return Promise.resolve(this.cache.get(npub));
  }
}