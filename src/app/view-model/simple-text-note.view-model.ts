import { Account, AccountRaw } from '@belomonte/nostr-ngx';
import Geohash from 'latlon-geohash';
import { NoteReplyContext } from './context/note-reply-context.interface';
import { NoteResourcesContext } from './context/note-resources-context.interface';
import { ParsedNostrContent } from './context/parsed-nostr-content.interface';
import { NostrEventViewModel } from './nostr-event.view-model';
import { NoteViewModel } from './note.view-model';
import { ReactionViewModel } from './reaction.view-model';
import { ZapViewModel } from './zap.view-model';
import { NostrViewModelSet } from './nostr-view-model.set';

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
  reposting?: NostrViewModelSet<NoteViewModel<AccountViewModel>, AccountViewModel>;

  /**
   * Record with all reacted reactions.
   * The record index is the used char/emoji to react.
   */
  reactions: { [emoji: string]: NostrViewModelSet<ReactionViewModel, AccountRaw> };

  /**
   * Parsed data of each zap to this event.
   */
  zaps: NostrViewModelSet<ZapViewModel, AccountRaw>;

  /**
   * Set of each view model that reposted this event.
   * It is considered a repost only if it does not include additional text from the user who shared it.
   */
  reposted: NostrViewModelSet<NoteViewModel<AccountViewModel>>;

  /**
   * Set of each view model that mentioned this event.
   * It is considered a mention if it include an additional commentary from the user who shared it.
   */
  mentioned: NostrViewModelSet<NoteViewModel<AccountViewModel>>;

  /**
   * Data about repling and be replied.
   */
  reply: NoteReplyContext<AccountViewModel>;

  /**
   * Hyperlinks and multimidia related to the note.
   */
  media: NoteResourcesContext;

  /**
   * Note attached location if g tag is included.
   */
  location?: Geohash.Point;
}
