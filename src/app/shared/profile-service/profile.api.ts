import { Injectable } from "@angular/core";
import { NostrEventKind } from "@domain/nostr-event-kind";
import { NostrPublicType } from "@domain/nostr-public.type";
import { NostrUser } from "@domain/nostr-user";
import { ApiService } from "@shared/api-service/api.service";
import { Event } from 'nostr-tools';

@Injectable()
export class ProfileApi {

  constructor(
    private apiService: ApiService
  ) {}

  loadProfile(npub: NostrPublicType): Promise<Event<NostrEventKind.Metadata>[]> {
    return this.apiService.get([
      {
        kinds: [
          NostrEventKind.Metadata
        ],
        authors: [
          String(new NostrUser(npub))
        ]
      }
    ])
  }
}