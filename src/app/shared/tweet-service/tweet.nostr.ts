import { Injectable } from '@angular/core';
import { HexString, NostrEvent, NostrPool } from '@belomonte/nostr-ngx';
import { Filter } from 'nostr-tools';
import { Repost, ShortTextNote } from 'nostr-tools/kinds';
import { FeedProxy } from './feed.proxy';
import { AccountViewModelProxy } from '@shared/view-model-mapper/account-view-model.proxy';
import { FeedMapper } from '@shared/view-model-mapper/feed.mapper';
import { FeedNostr } from './feed.nostr';

@Injectable({
  providedIn: 'root'
})
export class TweetNostr extends FeedProxy {

  constructor(
    private npool: NostrPool,
    protected accountViewModelProxy: AccountViewModelProxy,
    protected feedMapper: FeedMapper,
    protected feedNostr: FeedNostr
  ) {
    super();
  }

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