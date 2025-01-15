import { Account } from '@belomonte/nostr-ngx';
import { ParsedNostrContent } from './context/parsed-nostr-content.interface';
import { NoteViewModel } from './note.view-model';
import { SimpleTextNoteViewModel } from './simple-text-note.view-model';
import { SortedNostrViewModelSet } from './sorted-nostr-view-model.set';

/**
 * This interface represents the repost note
 * with all data ready to render into document
 */
export interface RepostNoteViewModel<AccountViewModel extends Account = Account> extends Omit<SimpleTextNoteViewModel<AccountViewModel>, 'content' | 'reposting'> {

  /**
   * @optional
   * Event content, with the raw value and the html parsed value
   */
  content?: ParsedNostrContent;

  /**
   * The reposted event
   */
  reposting: SortedNostrViewModelSet<NoteViewModel<AccountViewModel>, AccountViewModel>;

  /**
   * If event have only one reposting and the content comes empty
   */
  isSimpleRepost: boolean;
}
