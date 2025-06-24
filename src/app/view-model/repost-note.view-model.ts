import { NoteContentViewModel } from './context/note-content.view-model';
import { NoteViewModel } from './note.view-model';
import { SimpleTextNoteViewModel } from './simple-text-note.view-model';

/**
 * This interface represents the repost note
 * with all data ready to render into document
 */
export interface RepostNoteViewModel extends Omit<SimpleTextNoteViewModel, 'content' | 'type' | 'reposting'> {

  type: 'repost';

  /**
   * @optional
   * Event content, with the raw value and the html parsed value
   */
  content?: NoteContentViewModel;

  /**
   * The reposted event.
   * If the repost is referenced by a serialized event, the note will be an eager loaded object,
   * If the repost is one or more hex id of events, the notes will be lazy loaded objects.
   */
  reposting: Array<NoteViewModel>;

}
