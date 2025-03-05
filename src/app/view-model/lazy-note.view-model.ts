import { AccountRaw } from '@belomonte/nostr-ngx';
import { NostrEventViewModel } from './nostr-event.view-model';
import { RelatedContentViewModel } from './related-content.view-model';

export interface LazyNoteViewModel extends NostrEventViewModel<AccountRaw>, RelatedContentViewModel {
  /**
   * author account
   */
  author: AccountRaw;
}
