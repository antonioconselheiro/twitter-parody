import { Account } from '@belomonte/nostr-ngx';
import { LazyNoteViewModel } from './lazy-note.view-model';
import { RepostNoteViewModel } from './repost-note.view-model';
import { SimpleTextNoteViewModel } from './simple-text-note.view-model';

export type NoteViewModel<AccountViewModel extends Account = Account> = LazyNoteViewModel | SimpleTextNoteViewModel<AccountViewModel> | RepostNoteViewModel<AccountViewModel>;
