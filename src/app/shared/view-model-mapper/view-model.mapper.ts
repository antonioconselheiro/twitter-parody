import { NostrEvent } from '@belomonte/nostr-ngx';
import { NostrEventIdViewModel } from '@view-model/nostr-event-id.view-model';
import { NostrViewModelSet } from '@view-model/nostr-view-model.set';
import { SingleViewModelMapper } from './single-view-model.mapper';

/**
 * NostrEvent Mapper to ViewModel.
 * This interface will include signatures for your mapper be able to cast nostr events into ready to render data.
 * This methods return a promise because it reads the local cache, but this does not connect to pools or relays.
 */
export interface ViewModelMapper<
  ViewModelData extends NostrEventIdViewModel,
  ViewModelList = NostrViewModelSet<ViewModelData>
> extends SingleViewModelMapper<ViewModelData> {

  /**
   * cast a nostr event into ready to render data
   */
  toViewModel(event: NostrEvent): ViewModelData;

  /**
   * cast a list of nostr events into ready to render data
   */
  toViewModel(events: Array<NostrEvent>): ViewModelList;

}