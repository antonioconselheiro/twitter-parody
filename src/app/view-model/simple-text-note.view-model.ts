import { Account } from '@belomonte/nostr-ngx';
import Geohash from 'latlon-geohash';
import { NoteReplyContext } from './context/note-reply-context.interface';
import { NoteResourcesContext } from './context/note-resources-context.interface';
import { ParsedNostrContent } from './context/parsed-nostr-content.interface';
import { NostrEventViewModel } from './nostr-event.view-model';
import { NoteViewModel } from './note.view-model';
import { ReactionViewModel } from './reaction.view-model';
import { SortedNostrViewModelSet } from './sorted-nostr-view-model.set';
import { ZapViewModel } from './zap.view-model';

/**
 * This interface represents the simple text note
 * with all data ready to render into document
 */
export interface SimpleTextNoteViewModel<AccountViewModel extends Account> extends NostrEventViewModel<AccountViewModel> {

  /**
   * Event content, with the raw value and the html parsed value
   */
  content: ParsedNostrContent;

  /**
   * The reposted event
   */
  reposting?: SortedNostrViewModelSet<NoteViewModel<AccountViewModel>, AccountViewModel>;

  /**
   * Record with all reacted reactions.
   * The record index is the used char/emoji to react.
   */
  reactions: { [emoji: string]: SortedNostrViewModelSet<ReactionViewModel<Account>> };

  /**
   * Parsed data of each zap to this event
   */
  zaps: SortedNostrViewModelSet<ZapViewModel<Account>>;

  /**
   * array with non parsed nostr event of each event that reposted this event
   */
  reposted: SortedNostrViewModelSet<NoteViewModel<AccountViewModel>, AccountViewModel>;

  /**
   * data about repling and be replied
   */
  reply: NoteReplyContext<AccountViewModel>;

  /**
   * hyperlinks and multimidia related to the note
   */
  media: NoteResourcesContext;

  /**
   * Note attached location if g tag is included
   */
  location?: Geohash.Point;

  /**
   * Simple text is never a simple repost, but it can be into a list together with simple repost, so we start that with a default value
   */
  isSimpleRepost: false;
}
