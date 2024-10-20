import { RepostNoteViewModel } from './repost-note.view-model';
import { SimpleTextNoteViewModel } from './simple-text-note.view-model';
import { SortedNostrViewModelSet } from './sorted-nostr-view-model.set';

export type Feed = SortedNostrViewModelSet<SimpleTextNoteViewModel | RepostNoteViewModel>;