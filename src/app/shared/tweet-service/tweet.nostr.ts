import { Injectable } from '@angular/core';
import { HexString, NostrEvent, NostrPool } from '@belomonte/nostr-ngx';
import { Filter } from 'nostr-tools';
import { Reaction, Repost, ShortTextNote, Zap } from 'nostr-tools/kinds';
import { Observable } from 'rxjs';

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
   * @param event
   * note to listen replies, reposts, zaps and reactions updates
   *
   * @param mostRecentEvent
   * needed to avoid reload already loaded events 
   */
  listenNoteInteractions(event: NostrEvent<ShortTextNote | Repost>, mostRecentEvent?: NostrEvent): Observable<NostrEvent> {
    const filter: Filter = {
      kinds: [
        ShortTextNote,
        Repost,
        Reaction,
        Zap
      ],
      '#e': [event.id]
    };

    if (mostRecentEvent) {
      filter.since = mostRecentEvent.created_at;
    }

    return this.npool.observe([filter]);
  }
}