import { NoteViewModel } from './note.view-model';
import { SortedNostrViewModelSet } from './sorted-nostr-view-model.set';

export type Feed = SortedNostrViewModelSet<NoteViewModel>;
