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

  toViewModel(event: NostrEvent): Promise<ReactionViewModel<Account> | null>;
  toViewModel(event: NostrEvent<Reaction>): Promise<ReactionViewModel<Account>>;
  toViewModel(events: Array<NostrEvent>): Promise<Record<string, SortedNostrViewModelSet<ReactionViewModel<Account>>>>;
  toViewModel(event: NostrEvent | Array<NostrEvent>): Promise<ReactionViewModel<Account> | Record<string, SortedNostrViewModelSet<ReactionViewModel<Account>>> | null> {
    if (event instanceof Array) {
      return this.toMultipleViewModel(event);
    } else if (this.guard.isKind(event, Reaction)) {
      return this.toSingleViewModel(event);
    }

    return Promise.resolve(null);
  }

  private async toSingleViewModel(event: NostrEvent<Reaction>): Promise<ReactionViewModel<Account>> {
    const reactedTo = this.tagHelper.listIdsFromTag('e', event);
    const author = await this.profileProxy.loadAccount(event.pubkey, 'calculated');

    return Promise.resolve({
      id: event.id,
      content: event.content,
      reactedTo,
      event,
      author,
      //  TODO: ideally I should pass relay address from where this event come
      origin: [],
      createdAt: event.created_at
    });
  }

  private async toMultipleViewModel(events: Array<NostrEvent>): Promise<Record<string, SortedNostrViewModelSet<ReactionViewModel<Account>>>> {
    const reactionRecord: Record<string, SortedNostrViewModelSet<ReactionViewModel<Account>>> = {};

    for await (const event of events) {
      if (this.guard.isKind(event, Reaction)) {
        const sortedSet = reactionRecord[event.content] || new SortedNostrViewModelSet<ReactionViewModel<Account>>();
        const viewModel = await this.toSingleViewModel(event);
        sortedSet.add(viewModel);
      }
    }

    return Promise.resolve(reactionRecord);
  }
}
