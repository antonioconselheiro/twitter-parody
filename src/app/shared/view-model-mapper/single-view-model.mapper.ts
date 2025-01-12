import { Account } from '@belomonte/nostr-ngx';
import { NostrEvent } from '@nostrify/nostrify';
import { NostrEventViewModel } from '@view-model/nostr-event.view-model';

export interface SingleViewModelMapper<ViewModelData extends NostrEventViewModel<Account>> {
  /**
   * cast a nostr event into ready to render data
   */
  toViewModel(event: NostrEvent): Promise<ViewModelData>;
}