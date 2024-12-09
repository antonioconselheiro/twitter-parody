import { HexString } from '@belomonte/nostr-ngx';
import Geohash from 'latlon-geohash';
import { NoteReply } from './context/note-reply.interface';
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
export interface SimpleTextNoteViewModel extends NostrEventViewModel {

  /**
   * Event content, with the raw value and the html parsed value
   */
  content: ParsedNostrContent;

  /**
   * The reposted event
   */
  reposting?: Array<NoteViewModel>;

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
  repostedBy: Array<HexString>;

  /**
   * data about repling and be replied
   */
  replyContext: NoteReply;

  /**
   * hyperlinks and multimidia related to the note
   */
  media: NoteResourcesContext;

  /**
   * Note attached location if g tag is included
   */
  location?: Geohash.Point;
}
