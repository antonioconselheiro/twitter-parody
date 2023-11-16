import { Injectable } from "@angular/core";
import { NostrEventKind } from "@domain/nostr-event-kind.enum";
import { Event } from 'nostr-tools';
import { ProfileConverter } from "./profile.converter";
import { IProfile } from "@domain/profile.interface";
import { TNostrPublic } from "@domain/nostr-public.type";
import { DataLoadType } from "@domain/data-load.type";

@Injectable()
export class ProfileCache {

  static instance: ProfileCache | null = null;

  static profiles: {
    [npub: TNostrPublic]: IProfile
  } = {};

  constructor(
    private profileConverter: ProfileConverter
  )  {
    if (!ProfileCache.instance) {
      ProfileCache.instance = this;
    }

    return ProfileCache.instance;
  }

  get(npubs: string): IProfile;
  get(npubs: string[]): IProfile[];
  get(npubs: string[] | string): IProfile | IProfile[];
  get(npubs: string[] | string): IProfile | IProfile[] {
    if (typeof npubs === 'string') {
      return this.getLazily(npubs);
    } else {
      return npubs.map(npub => this.getLazily(npub));
    }
  }

  isEagerLoaded(npub: string): boolean {
    return this.get(npub).load === DataLoadType.EAGER_LOADED;
  }

  getFromPubKey(pubkey: string): IProfile {
    return this.get(this.profileConverter.castPubkeyToNostrPublic(pubkey));
  }

  private getLazily(npub: string): IProfile {
    if (ProfileCache.profiles[npub]) {
      return ProfileCache.profiles[npub];
    }

    return ProfileCache.profiles[npub] = this.profileConverter.getMetadataFromNostrPublic(npub);
  }

  cache(profiles: Event<NostrEventKind>[]): void;
  cache(profiles: IProfile[]): void;
  cache(profiles: IProfile[] | Event<NostrEventKind>[]): void;
  cache(profiles: IProfile[] | Event<NostrEventKind>[]): void {
    const profileList = (profiles as (IProfile | Event<NostrEventKind>)[]);
    profileList
      .filter((profile) => !('sig' in profile && profile.kind !== NostrEventKind.Metadata))
      .forEach(profile => this.cacheProfile(profile));
  }

  private cacheProfile(profile: IProfile | Event<NostrEventKind>): IProfile {
    if ('sig' in profile) {
      profile = this.profileConverter.convertEventToProfile(profile);
    }

    ProfileCache.profiles[profile.npub] = Object.assign(
      ProfileCache.profiles[profile.npub] || {},
      this.chooseNewer(profile, ProfileCache.profiles[profile.npub])
    );

    return ProfileCache.profiles[profile.npub];
  }

  private chooseNewer(updatedProfile: IProfile, indexedProfile: IProfile | undefined): IProfile {
    if (!indexedProfile || indexedProfile.load === DataLoadType.LAZY_LOADED) {
      return updatedProfile;
    }

    if (Number(updatedProfile.created_at) >= Number(indexedProfile.created_at)) {
      return updatedProfile;
    }

    return indexedProfile;
  }
}
