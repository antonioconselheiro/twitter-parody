import { Account } from '@belomonte/nostr-ngx';
import Geohash from 'latlon-geohash';
import { NoteResourcesContext } from './context/note-resources-context.interface';
import { ParsedNostrContent } from './context/parsed-nostr-content.interface';
import { NostrEventViewModel } from './nostr-event.view-model';
import { RelatedContentViewModel } from './related-content.view-model';

/**
 * This interface represents the simple text note
 * with all data ready to render into document
 */
export interface SimpleTextNoteViewModel<
  AccountViewModel extends Account,
  RelatedAccountViewModel extends Account = Account
> extends NostrEventViewModel<AccountViewModel>, RelatedContentViewModel<RelatedAccountViewModel> {

  /**
   * Event content, with the raw value and the html parsed value
   */
  content: ParsedNostrContent;

  /**
   * Hyperlinks and multimidia related to the note.
   */
  media: NoteResourcesContext;

  /**
   * Note attached location if g tag is included.
   */
  location?: Geohash.Point;
}
