import { AccountRaw } from '@belomonte/nostr-ngx';
import { NostrEventViewModel } from './nostr-event.view-model';

export interface LazyNoteViewModel extends NostrEventViewModel<AccountRaw> {
  /**
   * author account
   */
  author: AccountRaw;
}
