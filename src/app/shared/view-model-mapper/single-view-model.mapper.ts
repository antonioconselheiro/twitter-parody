import { NostrEvent } from '@nostrify/nostrify';
import { NostrEventViewModel } from '@view-model/nostr-event.view-model';

export interface SingleViewModelMapper<ViewModelData extends NostrEventViewModel> {
  /**
   * cast a nostr event into ready to render data
   */
  toViewModel(event: NostrEvent): Promise<ViewModelData>;
}