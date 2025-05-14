import { NostrEvent } from "@belomonte/nostr-ngx";

/**
 * Service implement this to indicate that there is a way
 * to feed a existing view model data with new events
 */
export interface ViewModelPatch<ViewModelData> {

  /**
   * add relationed data to view model
   */
  patchViewModel(viewModel: ViewModelData, events: Array<NostrEvent>): ViewModelData;

  /**
   * index relationed data to view model
   */
  indexViewModel(viewModel: ViewModelData, events: Array<NostrEvent>): ViewModelData;
}
