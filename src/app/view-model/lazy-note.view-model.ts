import { HexString } from '@belomonte/nostr-ngx';
import { NostrEventIdViewModel } from './nostr-event-id.view-model';
import { NoteContentSegmentViewModel } from './context/note-content-segment.view-model';

/**
 * Represents an event that was referenced but not loaded
 */
export interface LazyNoteViewModel extends NostrEventIdViewModel {

  type: 'lazy';

  author: null;
  event: null;
  origin: Array<WebSocket['url']>;

  /**
   * Event content, with the raw value and the html parsed value
   */
  content: undefined;

  /**
   * Image urls if has any
   */
  media: NoteContentSegmentViewModel[];

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

  reposting?: undefined;

  /**
   * Events can be related in many ways, this list should contain all event ids mentioned by this event.
   */
  readonly relates: Array<HexString>;
}
