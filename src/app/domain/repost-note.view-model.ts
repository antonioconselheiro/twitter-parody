import { ParsedNostrContent } from './parsed-nostr-content.interface';
import { SimpleTextNoteViewModel } from './simple-text-note.view-model';

/**
 * This interface represents the repost note
 * with all data ready to render into document
 */
export interface RepostNoteViewModel extends Omit<SimpleTextNoteViewModel, 'content'> {

  /**
   * @optional
   * Event content, with the raw value and the html parsed value
   */
  content?: ParsedNostrContent;

  /**
   * The reposted event
   */
  reposting: SimpleTextNoteViewModel | RepostNoteViewModel;
}
