import { NostrEventViewModel } from './nostr-event.view-model';
import { ParsedNostrContent } from './parsed-nostr-content.interface';
import { ReactionViewModel } from './reaction.view-model';
import { NoteReplyContext } from './note-reply-context.interface';
import { SortedNostrViewModelSet } from './sorted-nostr-view-model.set';
import { ZapViewModel } from './zap.view-model';
import Geohash from 'latlon-geohash';
import { NoteResourcesContext } from './note-resources-context.interface';

/**
 * This interface represents the simple text note
 * with all data ready to render into document
 */
export interface SimpleTextNoteViewModel extends NostrEventViewModel {

  /**
   * Event content, with the raw value and the html parsed value
   */
  content: ParsedNostrContent;

  /**
   * Record with all reacted reactions.
   * The record index is the used char/emoji to react.
   */
  reactions: Record<string, SortedNostrViewModelSet<ReactionViewModel>>;

  /**
   * Parsed data of each zap to this event
   */
  zaps: SortedNostrViewModelSet<ZapViewModel>;

  /**
   * array with event id of each event that reposted this event
   */
  repostedBy: Array<string>;

  /**
   * data about repling and be replied
   */
  replyContext: NoteReplyContext;

  /**
   * hyperlinks and multimidia related to the note
   */
  media: NoteResourcesContext;

  location?: Geohash.Point;
}
