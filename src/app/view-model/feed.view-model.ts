import { Account } from '@belomonte/nostr-ngx';
import { NoteViewModel } from './note.view-model';
import { NostrViewModelSet } from './nostr-view-model.set';

export type FeedViewModel<AccountViewModel extends Account = Account> = NostrViewModelSet<NoteViewModel<AccountViewModel>, AccountViewModel>;
