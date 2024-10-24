import { Injectable } from '@angular/core';
import { NostrEvent, NostrPool } from '@belomonte/nostr-ngx';
import { Reaction, Repost, ShortTextNote, Zap } from 'nostr-tools/kinds';

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
          ShortTextNote,
          Repost
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
          Reaction
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
          ShortTextNote
        ]
      },

      {
        kinds: [
          ShortTextNote,
          Repost
        ],
        '#e': events
      }
    ]);
  }

  loadRelatedEvents(events: string[]): Promise<NostrEvent[]> {
    return this.npool.query([
      {
        kinds: [
          ShortTextNote,
          Repost
        ],
        '#e': events
      }
    ]);
  }

  loadRelatedReactions(events: string[]): Promise<NostrEvent[]> {
    return this.npool.query([
      {
        kinds: [
          Reaction,
          Zap
        ],
        '#e': events
      }
    ]);
  }
}