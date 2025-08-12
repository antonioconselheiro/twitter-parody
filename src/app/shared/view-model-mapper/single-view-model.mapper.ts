import { NostrEvent } from '@belomonte/nostr-ngx';
import { NostrEventIdViewModel } from '@view-model/nostr-event-id.view-model';
import { RelayDomain } from '@view-model/relay-domain.type';

export interface SingleViewModelMapper<ViewModelData extends NostrEventIdViewModel> {
  /**
   * cast a nostr event into ready to render data
   */
  toViewModel(event: NostrEvent, origin: Array<RelayDomain>): ViewModelData;
}