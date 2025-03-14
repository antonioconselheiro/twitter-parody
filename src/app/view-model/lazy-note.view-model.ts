import { NostrEventViewModel } from './nostr-event.view-model';
import { RelatedContentViewModel } from './related-content.view-model';

export interface LazyNoteViewModel extends NostrEventViewModel, RelatedContentViewModel {

  /**
   * Event content, with the raw value and the html parsed value
   */
  content: undefined;

  /**
   * Hyperlinks and multimidia related to the note.
   */
  media: undefined;

  /**
   * Note attached location if g tag is included.
   */
  location: undefined;
}
