import { NostrEvent } from "@belomonte/nostr-ngx";

export interface ViewModelPatch<ViewModelData> {

  /**
   * add relationed data to view model
   */
  patchViewModel(viewModel: ViewModelData, events: Array<NostrEvent>): Promise<ViewModelData>;
}
