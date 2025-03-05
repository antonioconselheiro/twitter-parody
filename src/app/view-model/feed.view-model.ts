import { Account } from '@belomonte/nostr-ngx';
import { EagerNoteViewModel } from './eager-note.view-model';
import { NostrViewModelSet } from './nostr-view-model.set';

export type FeedViewModel<AccountViewModel extends Account = Account> = NostrViewModelSet<EagerNoteViewModel<AccountViewModel>, AccountViewModel>;
