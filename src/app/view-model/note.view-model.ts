import { Account } from '@belomonte/nostr-ngx';
import { EagerNoteViewModel } from './eager-note.view-model';
import { LazyNoteViewModel } from './lazy-note.view-model';

export type NoteViewModel<AccountViewModel extends Account = Account> = LazyNoteViewModel | EagerNoteViewModel<AccountViewModel>;
