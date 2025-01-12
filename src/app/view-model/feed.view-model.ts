import { Account } from '@belomonte/nostr-ngx';
import { NoteViewModel } from './note.view-model';
import { SortedNostrViewModelSet } from './sorted-nostr-view-model.set';

export type FeedViewModel<AccountViewModel extends Account = Account> = SortedNostrViewModelSet<NoteViewModel<AccountViewModel>, AccountViewModel>;
