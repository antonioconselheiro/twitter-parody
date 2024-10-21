import { Account } from '@belomonte/nostr-ngx';
import { Feed } from './feed.type';
import { RepostNoteViewModel } from './repost-note.view-model';
import { SimpleTextNoteViewModel } from './simple-text-note.view-model';
import { UnloadedFeedReferences } from './unloaded-feed-references.interface';

export interface RelatedFeedAggregator {
  /**
   * Simple text note and repost note
   */
  feed: Feed;

  /**
   * Events referenced by feed, like respoted content 
   */
  referenced: Map<string, SimpleTextNoteViewModel | RepostNoteViewModel>,

  /**
   * accounts related to the load feed
   */
  accounts: Set<Account>;

  /**
   * Related events and pubkeys that could not possible to find
   * anything in cache and must be load using differents relays
   */
  unloaded: UnloadedFeedReferences;
}
