import { Injectable } from '@angular/core';
import { HexString, NostrEvent, NostrPool } from '@belomonte/nostr-ngx';
import { Filter } from 'nostr-tools';
import { Reaction, Repost, ShortTextNote, Zap } from 'nostr-tools/kinds';
import { debounceTime, map, Observable, scan } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TweetNostr {

  constructor(
    private npool: NostrPool
  ) { }

  /**
   * List nostr events published by a pubkey
   */
  listUserNotes(pubkey: HexString): Promise<Array<NostrEvent>> {
    //  TODO: include pagination
    return this.npool.query([
      {
        kinds: [
          ShortTextNote,
          Repost
        ],
        authors: [pubkey]
      }
    ]);
  }

  /**
   * Load replies, reposts, reactions and zaps of a list of nostr events
   */
  loadRelatedContent(events: Array<HexString>): Promise<Array<NostrEvent>> {
    return this.npool.query([
      {
        kinds: [
          ShortTextNote,
          Repost,
          Reaction,
          Zap
        ],
        '#e': events
      }
    ]);
  }

  /**
   * @param feed
   * only the main event of the feed, as an array
   *
   * @param mostRecentEvent
   * the newer event of the feed, it can be a short text note, a repost note, a reaction or a zap 
   */
  listenFeedUpdates(feed: Array<NostrEvent>, mostRecentEvent?: NostrEvent): Observable<Array<NostrEvent>> {
    const ids = feed.map(event => event.id);
    const filter: Filter = {
      ids,
      kinds: [
        ShortTextNote,
        Repost,
        Reaction,
        Zap
      ],
      '#e': ids
    };

    if (mostRecentEvent) {
      filter.since = mostRecentEvent.created_at;
    }

    const groupingEventsTime = 300;
    return this.npool.observe([filter]).pipe(
      scan((acc: NostrEvent[], value: NostrEvent) => [...acc, value], new Array<NostrEvent>()),
      debounceTime(groupingEventsTime),
      map(items => items)
    );
  }
}