import { Injectable } from "@angular/core";
import { EventId } from "@domain/event-id.type";
import { NostrEventKind } from "@domain/nostr-event-kind";
import { NostrUser } from "@domain/nostr-user";
import { ApiService } from "@shared/api-service/api.service";
import { Event } from 'nostr-tools';

@Injectable({
  providedIn: 'root'
})
export class TweetApi {

  constructor(
    private apiService: ApiService
  ) { }

  listTweetsFrom(npub: string): Promise<Event<NostrEventKind.Text | NostrEventKind.Repost>[]> {
    return this.apiService.get([
      {
        kinds: [
          NostrEventKind.Text,
          NostrEventKind.Repost
        ],
        authors: [
          String(new NostrUser(npub))
        ]
      }
    ]);
  }

  listReactionsFrom(npub: string): Promise<Event<NostrEventKind.Reaction>[]> {
    return this.apiService.get([
      {
        kinds: [
          NostrEventKind.Reaction
        ],
        authors: [
          String(new NostrUser(npub))
        ]
      }
    ]);
  }

  loadEvents(events: EventId[]): Promise<Event<
    NostrEventKind.Text | NostrEventKind.Repost | NostrEventKind.Reaction | NostrEventKind.Zap
  >[]> {
    return this.apiService.get([
      {
        ids: events,
        kinds: [
          NostrEventKind.Text
        ]
      }
    ]);
  }

  loadRelatedEvents(events: EventId[]): Promise<Event<
    NostrEventKind.Text | NostrEventKind.Repost | NostrEventKind.Reaction | NostrEventKind.Zap
  >[]> {
    return this.apiService.get([
      {
        kinds: [
          NostrEventKind.Text,
          NostrEventKind.Repost,
          NostrEventKind.Reaction,
          NostrEventKind.Zap
        ],
        '#e': events
      }
    ]);
  }
}