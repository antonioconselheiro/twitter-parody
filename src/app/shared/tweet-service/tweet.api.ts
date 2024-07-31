import { Injectable } from "@angular/core";
import { NostrConverter, NostrEventKind, NostrService } from "@belomonte/nostr-ngx";
import { TEventId } from "@domain/event-id.type";
import { NostrEvent } from 'nostr-tools';

@Injectable({
  providedIn: 'root'
})
export class TweetApi {

  constructor(
    private nostrService: NostrService,
    private nostrConverter: NostrConverter
  ) { }

  listTweetsFromNostrPublics(npubs: string[]): Promise<NostrEvent[]> {
    return this.nostrService.request([
      {
        kinds: [
          NostrEventKind.Text,
          NostrEventKind.Repost
        ],
        authors: npubs.map(npub => this.nostrConverter.castNostrPublicToPubkey(npub)),
        limit: 25
      }
    ]);
  }

  listReactionsFrom(npub: string): Promise<NostrEvent[]> {
    return this.nostrService.request([
      {
        kinds: [
          NostrEventKind.Reaction
        ],
        authors: [
          this.nostrConverter.castNostrPublicToPubkey(npub)
        ],
        limit: 25
      }
    ]);
  }

  loadEvents(events: TEventId[]): Promise<NostrEvent[]> {
    return this.nostrService.request([
      {
        ids: events,
        kinds: [
          NostrEventKind.Text
        ]
      },

      {
        kinds: [
          NostrEventKind.Text,
          NostrEventKind.Repost
        ],
        '#e': events
      }
    ]);
  }

  loadRelatedEvents(events: TEventId[]): Promise<NostrEvent[]> {
    return this.nostrService.request([
      {
        kinds: [
          NostrEventKind.Text,
          NostrEventKind.Repost
        ],
        '#e': events
      }
    ]);
  }

  loadRelatedReactions(events: TEventId[]): Promise<NostrEvent[]> {
    return this.nostrService.request([
      {
        kinds: [
          NostrEventKind.Reaction,
          NostrEventKind.Zap
        ],
        '#e': events
      }
    ]);
  }
}