import { Inject, Injectable } from '@angular/core';
import { MAIN_NCACHE_TOKEN, NostrEvent } from '@belomonte/nostr-ngx';
import { NCache } from '@nostrify/nostrify';
import { ReactionViewModel } from '@view-model/reaction.view-model';
import { SortedNostrViewModelSet } from '@view-model/sorted-nostr-view-model.set';
import { ViewModelMapper } from './view-model.mapper';
import { kinds } from 'nostr-tools';
import { Reaction } from 'nostr-tools/kinds';

@Injectable({
  providedIn: 'root'
})
export class ReactionMapper implements ViewModelMapper<ReactionViewModel, Record<string, SortedNostrViewModelSet<ReactionViewModel>>> {

  constructor(
    @Inject(MAIN_NCACHE_TOKEN) private ncache: NCache
  ) { }

  toViewModel(event: NostrEvent<Reaction>): Promise<ReactionViewModel>;
  toViewModel(events: Array<NostrEvent<Reaction>>): Promise<Record<string, SortedNostrViewModelSet<ReactionViewModel>>>;
  toViewModel(event: NostrEvent<Reaction> | Array<NostrEvent<Reaction>>): Promise<ReactionViewModel | Record<string, SortedNostrViewModelSet<ReactionViewModel>>> {
    if (event instanceof Array) {
      return this.toMultipleViewModel(event);
    } else {
      return this.toSingleViewModel(event);
    }
  }

  private toSingleViewModel(event: NostrEvent<Reaction>): Promise<ReactionViewModel> {

  }

  private toMultipleViewModel(events: Array<NostrEvent<Reaction>>): Promise<Record<string, SortedNostrViewModelSet<ReactionViewModel>>> {

  }
}
