import { EagerNoteViewModel } from './eager-note.view-model';
import { LazyNoteViewModel } from './lazy-note.view-model';

export type NoteViewModel = LazyNoteViewModel | EagerNoteViewModel;
