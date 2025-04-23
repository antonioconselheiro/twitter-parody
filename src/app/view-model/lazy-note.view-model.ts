import { NostrEventIdViewModel } from './nostr-event-id.view-model';

/**
 * Represents an event that was referenced but not loaded
 */
export interface LazyNoteViewModel extends NostrEventIdViewModel {

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

  /**
   * first message from thread
   */
  rootRepling?: undefined;

  /**
   * if this simple text is a reply, this will be
   * filled with the replied note
   */
  replingTo?: undefined;
}
