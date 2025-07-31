import { Injectable } from '@angular/core';
import { HexString, NostrEvent, NostrPool } from '@belomonte/nostr-ngx';
import { Filter } from 'nostr-tools';
import { Repost, ShortTextNote } from 'nostr-tools/kinds';

@Injectable({
  providedIn: 'root'
})
export class TweetNostr {

  constructor(
    private npool: NostrPool
  ) { }

  loadTweet(event: HexString): Promise<NostrEvent> {
    const filter: Filter = {
      ids: [ event ],
      kinds: [
        ShortTextNote,
        Repost
      ],
      limit: 1
    };

    return this.npool.query([filter]).then(([event]) => event);
  }

}