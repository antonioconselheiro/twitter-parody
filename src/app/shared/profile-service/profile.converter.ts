import { Injectable } from "@angular/core";
import { NostrUser } from "@domain/nostr-user";
import { IProfile } from "@domain/profile.interface";
import { DataLoadType } from "@domain/data-load.type";
import { Event, nip19 } from 'nostr-tools';
import { NostrEventKind } from "@domain/nostr-event-kind";
import { HtmlfyService } from "@shared/htmlfy/htmlfy.service";

@Injectable()
export class ProfileConverter {

  constructor(
    private htmlfy: HtmlfyService
  ) {}

  castPubkeyToNostrPublic(pubkey: string): string {
    return nip19.npubEncode(pubkey);
  }

  getMetadataFromNostrPublic(npub: string): IProfile {
    return { npub, user: new NostrUser(npub), load: DataLoadType.LAZY_LOADED };
  }

  convertEventToProfile(profile: Event<NostrEventKind>, mergeWith?: IProfile ): IProfile {
    const metadata = JSON.parse(profile.content);
    const npub = nip19.npubEncode(profile.pubkey);
    const htmlAbout = metadata.about && this.htmlfy.safify(metadata.about)
    let newProfile: IProfile;
    if (mergeWith) {
      newProfile = mergeWith;
      newProfile.npub = npub;
      newProfile.user = new NostrUser(npub);
      newProfile.load = DataLoadType.EAGER_LOADED;
      Object.assign(newProfile, metadata);
    } else {
      newProfile = {
        npub: npub,
        user: new NostrUser(npub),
        load: DataLoadType.EAGER_LOADED,
        ...metadata
      }
    }

    if (htmlAbout) {
      newProfile.htmlAbout = htmlAbout;
    }

    return newProfile;
  }
}