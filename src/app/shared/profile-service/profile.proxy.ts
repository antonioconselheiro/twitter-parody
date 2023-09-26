import { Injectable } from "@angular/core";
import { IProfile } from "../../domain/profile.interface";
import { ProfileConverter } from "./profile.converter";
import { ProfileCache } from "./profile.cache";
import { ProfileApi } from "./profile.api";
import { Event } from 'nostr-tools';
import { NostrEventKind } from "@domain/nostr-event-kind";

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
      return ProfileCache.profiles[npubs] && Promise.resolve(ProfileCache.profiles[npubs]) || this.loadProfile(npubs);
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
    if (profile && profile.name) {
      return Promise.resolve(profile);
    }

    const events = await this.profileApi.loadProfile(npub);
    this.profileCache.cache(events);
    return Promise.resolve(this.profileCache.get(npub));
  }
}
