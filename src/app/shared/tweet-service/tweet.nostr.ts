import { Injectable } from '@angular/core';
import { HexString, NostrEvent, NostrPool } from '@belomonte/nostr-ngx';
import { Reaction, Repost, ShortTextNote, Zap } from 'nostr-tools/kinds';

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
}