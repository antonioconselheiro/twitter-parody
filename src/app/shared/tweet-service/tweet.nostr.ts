import { Injectable } from '@angular/core';
import { AccountViewModelProxy, FeedMapper, HexString, NostrEventWithRelays, NostrPool } from '@belomonte/nostr-ngx';
import { Filter } from 'nostr-tools';
import { Repost, ShortTextNote } from 'nostr-tools/kinds';
import { FeedNostr } from './feed.nostr';
import { FeedProxy } from './feed.proxy';

@Injectable({
  providedIn: 'root'
})
export class TweetNostr extends FeedProxy {

  constructor(
    private nostrPool: NostrPool,
    protected accountViewModelProxy: AccountViewModelProxy,
    protected feedMapper: FeedMapper,
    protected feedNostr: FeedNostr
  ) {
    super();
  }

  loadTweet(event: HexString): Promise<NostrEventWithRelays> {
    const filter: Filter = {
      ids: [ event ],
      kinds: [
        ShortTextNote,
        Repost
      ],
      limit: 1
    };

    return this.nostrPool.query([filter]).then(([event]) => event);
  }

  loadFeedUntilTweet(pubkey: HexString, event: HexString): Promise<NostrEventWithRelays[]> {
    const filter: Filter = {
      ids: [ event ],
      authors: [ pubkey ],
      kinds: [
        ShortTextNote,
        Repost
      ]
    };

    return this.nostrPool.query([filter])
  }

}