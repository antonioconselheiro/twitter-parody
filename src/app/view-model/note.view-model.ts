import { Account, AccountRaw } from '@belomonte/nostr-ngx';
import { RepostNoteViewModel } from './repost-note.view-model';
import { SimpleTextNoteViewModel } from './simple-text-note.view-model';
import { LazyNoteViewModel } from './lazy-note.view-model';

export type NoteViewModel<AccountViewModel extends Account | AccountRaw = Account> = LazyNoteViewModel | SimpleTextNoteViewModel<AccountViewModel> | RepostNoteViewModel<AccountViewModel>;
