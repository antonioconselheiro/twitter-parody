import { NostrEventIdViewModel } from './nostr-event-id.view-model';
import { RelatedContentViewModel } from './related-content.view-model';

/**
 * Represents an event that was referenced but not loaded
 */
export interface LazyNoteViewModel extends NostrEventIdViewModel, RelatedContentViewModel {

  author: null;
  event: null;
  origin: Array<WebSocket['url']>;

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
