import { Injectable } from '@angular/core';
import { NostrPool } from '@belomonte/nostr-ngx';
import { kinds, NostrEvent } from 'nostr-tools';

@Injectable({
  providedIn: 'root'
})
export class TweetApi {

  constructor(
    private npool: NostrPool
  ) { }

  listTweetsFromPubkeyList(pubkeys: Array<string>): Promise<NostrEvent[]> {
    return this.npool.query([
      {
        kinds: [
          kinds.ShortTextNote,
          kinds.Repost
        ],
        authors: pubkeys,
        limit: 25
      }
    ]);
  }

  listReactionsFromPubkey(pubkey: string): Promise<NostrEvent[]> {
    return this.npool.query([
      {
        kinds: [
          kinds.Reaction
        ],
        authors: [
          pubkey
        ],
        limit: 25
      }
    ]);
  }

  loadEvents(events: string[]): Promise<NostrEvent[]> {
    return this.npool.query([
      {
        ids: events,
        kinds: [
          kinds.ShortTextNote
        ]
      },

      {
        kinds: [
          kinds.ShortTextNote,
          kinds.Repost
        ],
        '#e': events
      }
    ]);
  }

  loadRelatedEvents(events: string[]): Promise<NostrEvent[]> {
    return this.npool.query([
      {
        kinds: [
          kinds.ShortTextNote,
          kinds.Repost
        ],
        '#e': events
      }
    ]);
  }

  loadRelatedReactions(events: string[]): Promise<NostrEvent[]> {
    return this.npool.query([
      {
        kinds: [
          kinds.Reaction,
          kinds.Zap
        ],
        '#e': events
      }
    ]);
  }
}