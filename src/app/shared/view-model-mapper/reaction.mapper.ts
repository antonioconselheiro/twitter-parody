import { Injectable } from '@angular/core';
import { Account, NostrEvent, NostrGuard, ProfileProxy } from '@belomonte/nostr-ngx';
import { ReactionViewModel } from '@view-model/reaction.view-model';
import { SortedNostrViewModelSet } from '@view-model/sorted-nostr-view-model.set';
import { Reaction } from 'nostr-tools/kinds';
import { TagHelper } from './tag.helper';
import { ViewModelMapper } from './view-model.mapper';

@Injectable({
  providedIn: 'root'
})
export class ReactionMapper implements ViewModelMapper<ReactionViewModel<Account>, Record<string, SortedNostrViewModelSet<ReactionViewModel<Account>>>> {

  constructor(
    private tagHelper: TagHelper,
    private profileProxy: ProfileProxy,
    private guard: NostrGuard
  ) { }

  toViewModel(event: NostrEvent): ReactionViewModel<Account> | null;
  toViewModel(event: NostrEvent<Reaction>): ReactionViewModel<Account>;
  toViewModel(events: Array<NostrEvent>): Record<string, SortedNostrViewModelSet<ReactionViewModel<Account>>>;
  toViewModel(event: NostrEvent | Array<NostrEvent>): ReactionViewModel<Account> | Record<string, SortedNostrViewModelSet<ReactionViewModel<Account>>> | null {
    if (event instanceof Array) {
      return this.toMultipleViewModel(event);
    } else if (this.guard.isKind(event, Reaction)) {
      return this.toSingleViewModel(event);
    }

    return null;
  }

  private toSingleViewModel(event: NostrEvent<Reaction>): ReactionViewModel {
    const reactedTo = this.tagHelper.listIdsFromTag('e', event);
    const author = this.profileProxy.getAccount(event.pubkey);

    return {
      id: event.id,
      content: event.content,
      reactedTo,
      event,
      author,
      //  TODO: ideally I should pass relay address from where this event come
      origin: [],
      createdAt: event.created_at
    };
  }

  private toMultipleViewModel(events: Array<NostrEvent>): Record<string, SortedNostrViewModelSet<ReactionViewModel>> {
    const reactionRecord: Record<string, SortedNostrViewModelSet<ReactionViewModel>> = {};

    for (const event of events) {
      if (this.guard.isKind(event, Reaction)) {
        const sortedSet = reactionRecord[event.content] || new SortedNostrViewModelSet<ReactionViewModel<Account>>();
        const viewModel = this.toSingleViewModel(event);
        sortedSet.add(viewModel);
      }
    }

    return reactionRecord;
  }
}
