import { NostrEvent } from '@nostrify/nostrify';
import { NostrEventIdViewModel } from '@view-model/nostr-event-id.view-model';

export interface SingleViewModelMapper<ViewModelData extends NostrEventIdViewModel> {
  /**
   * cast a nostr event into ready to render data
   */
  toViewModel(event: NostrEvent): ViewModelData;
}