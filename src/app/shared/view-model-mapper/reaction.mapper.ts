import { Inject, Injectable } from '@angular/core';
import { MAIN_NCACHE_TOKEN } from '@belomonte/nostr-ngx';
import { NCache, NostrEvent } from '@nostrify/nostrify';
import { ReactionViewModel } from '@view-model/reaction.view-model';
import { SortedNostrViewModelSet } from '@view-model/sorted-nostr-view-model.set';
import { ViewModelMapper } from './view-model.mapper';

@Injectable({
  providedIn: 'root'
})
export class ReactionMapper implements ViewModelMapper<ReactionViewModel, Record<string, SortedNostrViewModelSet<ReactionViewModel>>> {

  constructor(
    @Inject(MAIN_NCACHE_TOKEN) private ncache: NCache
  ) { }

  toViewModel(event: NostrEvent): Promise<ReactionViewModel>;
  toViewModel(events: Array<NostrEvent>): Promise<Record<string, SortedNostrViewModelSet<ReactionViewModel>>>;
  toViewModel(event: NostrEvent | Array<NostrEvent>): Promise<ReactionViewModel | Record<string, SortedNostrViewModelSet<ReactionViewModel>>> {
    if (event instanceof Array) {
      return this.toMultipleViewModel(event);
    } else {
      return this.toSingleViewModel(event);
    }
  }

  private toSingleViewModel(event: NostrEvent): Promise<ReactionViewModel> {

  }

  private toMultipleViewModel(events: Array<NostrEvent>): Promise<Record<string, SortedNostrViewModelSet<ReactionViewModel>>> {

  }
}
