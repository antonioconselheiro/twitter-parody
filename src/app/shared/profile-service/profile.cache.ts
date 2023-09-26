import { Injectable } from "@angular/core";
import { NostrEventKind } from "@domain/nostr-event-kind";
import { Event } from 'nostr-tools';
import { ProfileConverter } from "./profile.converter";
import { IProfile } from "@domain/profile.interface";
import { TNostrPublic } from "@domain/nostr-public.type";

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

  getFromPubKey(pubkey: string): IProfile {
    return this.get(this.profileConverter.castPubkeyToNostrPublic(pubkey));
  }

  private getLazily(npub: string): IProfile {
    if (ProfileCache.profiles[npub]) {
      return ProfileCache.profiles[npub];
    }

    return this.profileConverter.getMetadataFromNostrPublic(npub);
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

    return ProfileCache.profiles[profile.npub] = this.chooseNewer(profile, ProfileCache.profiles[profile.npub]);
  }

  private chooseNewer(updatedProfile: IProfile, indexedProfile: IProfile | undefined): IProfile {
    if (!indexedProfile) {
      return updatedProfile;
    }

    if (Number(updatedProfile.created_at) >= Number(indexedProfile.created_at)) {
      return updatedProfile;
    }

    return indexedProfile;
  }
}
