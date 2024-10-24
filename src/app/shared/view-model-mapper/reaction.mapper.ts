import { Inject, Injectable } from '@angular/core';
import { HexString, MAIN_NCACHE_TOKEN, NostrEvent, NostrGuard, unixDate } from '@belomonte/nostr-ngx';
import { NCache } from '@nostrify/nostrify';
import { ReactionViewModel } from '@view-model/reaction.view-model';
import { SortedNostrViewModelSet } from '@view-model/sorted-nostr-view-model.set';
import { Reaction } from 'nostr-tools/kinds';
import { ViewModelMapper } from './view-model.mapper';

@Injectable({
  providedIn: 'root'
})
export class ReactionMapper implements ViewModelMapper<ReactionViewModel, Record<string, SortedNostrViewModelSet<ReactionViewModel>>> {

  constructor(
    private guard: NostrGuard,
    @Inject(MAIN_NCACHE_TOKEN) private ncache: NCache
  ) { }

  toViewModel(event: NostrEvent): Promise<ReactionViewModel | null>;
  toViewModel(event: NostrEvent<Reaction>): Promise<ReactionViewModel>;
  toViewModel(events: Array<NostrEvent>): Promise<Record<string, SortedNostrViewModelSet<ReactionViewModel>>>;
  toViewModel(event: NostrEvent | Array<NostrEvent>): Promise<ReactionViewModel | Record<string, SortedNostrViewModelSet<ReactionViewModel>> | null> {
    if (event instanceof Array) {
      return this.toMultipleViewModel(event);
    } else if (this.guard.isKind(event, Reaction)) {
      return this.toSingleViewModel(event);
    }

    return Promise.resolve(null);
  }

  private toSingleViewModel(event: NostrEvent<Reaction>): Promise<ReactionViewModel> {
    const reactedTo: Array<HexString> = event.tags
      .filter(([type, idEvent]) => type === 'e' && this.guard.isHexadecimal(idEvent))
      .map((touple) => touple[1]);

    return Promise.resolve({
      id: event.id,
      content: event.content,
      reactedTo,
      author: event.pubkey,
      createdAt: event.created_at
    });
  }

  private toMultipleViewModel(events: Array<NostrEvent>): Promise<Record<string, SortedNostrViewModelSet<ReactionViewModel>>> {

  }
}
