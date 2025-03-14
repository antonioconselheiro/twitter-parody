import { ParsedNostrContent } from './context/parsed-nostr-content.interface';
import { EagerNoteViewModel } from './eager-note.view-model';
import { LazyNoteViewModel } from './lazy-note.view-model';
import { NostrViewModelSet } from './nostr-view-model.set';
import { SimpleTextNoteViewModel } from './simple-text-note.view-model';

/**
 * This interface represents the repost note
 * with all data ready to render into document
 */
export interface RepostNoteViewModel extends Omit<SimpleTextNoteViewModel, 'content' | 'reposting'> {

  /**
   * @optional
   * Event content, with the raw value and the html parsed value
   */
  content?: ParsedNostrContent;

  /**
   * The reposted event
   */
  reposting: NostrViewModelSet<EagerNoteViewModel> | NostrViewModelSet<LazyNoteViewModel>;

}
