import { Injectable } from '@angular/core';
import { NostrEventKind, NostrPool } from '@belomonte/nostr-ngx';
import { TEventId } from '@domain/event-id.type';
import { NostrEvent } from 'nostr-tools';

@Injectable({
  providedIn: 'root'
})
export class TweetApi {

  constructor(
    private npool: NostrPool
  ) { }

  listTweetsFromPubkeyList(pubkeys: Array<string>): Promise<NostrEvent[]> {
    return this.npool.request([
      {
        kinds: [
          NostrEventKind.ShortTextNote,
          NostrEventKind.Repost
        ],
        authors: pubkeys,
        limit: 25
      }
    ]);
  }

  listReactionsFromPubkey(pubkey: string): Promise<NostrEvent[]> {
    return this.npool.request([
      {
        kinds: [
          NostrEventKind.Reaction
        ],
        authors: [
          pubkey
        ],
        limit: 25
      }
    ]);
  }

  loadEvents(events: TEventId[]): Promise<NostrEvent[]> {
    return this.npool.request([
      {
        ids: events,
        kinds: [
          NostrEventKind.ShortTextNote
        ]
      },

      {
        kinds: [
          NostrEventKind.ShortTextNote,
          NostrEventKind.Repost
        ],
        '#e': events
      }
    ]);
  }

  loadRelatedEvents(events: TEventId[]): Promise<NostrEvent[]> {
    return this.npool.request([
      {
        kinds: [
          NostrEventKind.ShortTextNote,
          NostrEventKind.Repost
        ],
        '#e': events
      }
    ]);
  }

  loadRelatedReactions(events: TEventId[]): Promise<NostrEvent[]> {
    return this.npool.request([
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