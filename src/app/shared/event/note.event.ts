import { NoteViewModel } from '@view-model/note.view-model';
import { RelatedContentViewModel } from '@view-model/related-content.view-model';

export interface NoteEvent {
  note: RelatedContentViewModel<NoteViewModel>;
  trigger: HTMLElement;
}
