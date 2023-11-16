import { Injectable } from "@angular/core";
import { NostrEventKind } from "@domain/nostr-event-kind.enum";
import { TNostrPublic } from "@domain/nostr-public.type";
import { NostrUser } from "@domain/nostr-user";
import { ApiService } from "@shared/api-service/api.service";
import { Event } from 'nostr-tools';

@Injectable()
export class ProfileApi {

  constructor(
    private apiService: ApiService
  ) { }

  loadProfiles(npubs: Array<TNostrPublic>): Promise<Event<NostrEventKind.Metadata>[]> {
    return this.apiService.get([
      {
        kinds: [
          NostrEventKind.Metadata
        ],
        authors: npubs.map(npub => (new NostrUser(npub)).publicKeyHex)
      }
    ])
  }
}
