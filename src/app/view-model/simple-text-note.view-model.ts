import { HexString } from '@belomonte/nostr-ngx';
import Geohash from 'latlon-geohash';
import { NostrEventViewModel } from './nostr-event.view-model';
import { NoteContentViewModel } from './context/note-content.view-model';

/**
 * This interface represents the simple text note
 * with all data ready to render into document
 */
export interface SimpleTextNoteViewModel extends NostrEventViewModel {

  type: 'simple';

  /**
   * Event content, with the raw value and the html parsed value
   */
  content: NoteContentViewModel;

  /**
   * Image urls if has any
   */
  images: string[];

  /**
   * Video urls if has any
   */
  videos: string[];

  /**
   * Note attached location if g tag is included.
   */
  location?: Geohash.Point;

  /**
   * first message from thread
   */
  readonly rootRepling?: HexString;

  /**
   * if this simple text is a reply, this will be
   * filled with the replied note
   */
  readonly replingTo?: HexString;

  readonly reposting?: undefined;
}
