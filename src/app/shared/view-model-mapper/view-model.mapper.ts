import { NostrEvent } from '@nostrify/nostrify';
import { NostrEventViewModel } from '@view-model/nostr-event.view-model';
import { SortedNostrViewModelSet } from '@view-model/sorted-nostr-view-model.set';
import { SingleViewModelMapper } from './single-view-model.mapper';

/**
 * NostrEvent Mapper to ViewModel.
 * This interface will include signatures for your mapper be able to cast nostr events into ready to render data.
 * This methods return a promise because it reads the local cache, but this does not connect to pools or relays.
 */
export interface ViewModelMapper<ViewModelData extends NostrEventViewModel, ViewModelList = SortedNostrViewModelSet<ViewModelData>> extends SingleViewModelMapper<ViewModelData> {

  /**
   * cast a nostr event into ready to render data
   */
  toViewModel(event: NostrEvent): Promise<ViewModelData>;

  /**
   * cast a list of nostr events into ready to render data
   * @param events 
   */
  toViewModel(events: Array<NostrEvent>): Promise<ViewModelList>;
}