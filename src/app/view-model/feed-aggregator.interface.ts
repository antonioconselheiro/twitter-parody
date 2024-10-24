import { Account } from '@belomonte/nostr-ngx';
import { Feed } from './feed.type';
import { UnloadedFeedReferences } from './unloaded-feed-references.interface';

export interface FeedAggregator {
  /**
   * Simple text note and repost note
   */
  feed: Feed;

  /**
   * accounts related to the load feed
   */
  accounts: Set<Account>;

  /**
   * user and events not find and not loaded
   */
  unloaded: UnloadedFeedReferences;
}
