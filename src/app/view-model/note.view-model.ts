import { Account } from '@belomonte/nostr-ngx';
import { RepostNoteViewModel } from './repost-note.view-model';
import { SimpleTextNoteViewModel } from './simple-text-note.view-model';

export type NoteViewModel<AccountViewModel extends Account = Account> = SimpleTextNoteViewModel<AccountViewModel> | RepostNoteViewModel<AccountViewModel>;
