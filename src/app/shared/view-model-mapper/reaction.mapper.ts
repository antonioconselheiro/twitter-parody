import { Injectable } from '@angular/core';
import { AccountRaw, NostrEvent, NostrGuard, ProfileProxy } from '@belomonte/nostr-ngx';
import { NostrViewModelSet } from '@view-model/nostr-view-model.set';
import { ReactionViewModel } from '@view-model/reaction.view-model';
import { ViewModelMapper } from './view-model.mapper';
import { Reaction } from 'nostr-tools/kinds';
import { TagHelper } from './tag.helper';

@Injectable({
  providedIn: 'root'
})
export class ReactionMapper implements ViewModelMapper<ReactionViewModel<AccountRaw>, Record<string, NostrViewModelSet<ReactionViewModel<AccountRaw>, AccountRaw>>> {

  constructor(
    private tagHelper: TagHelper,
    private profileProxy: ProfileProxy,
    private guard: NostrGuard
  ) { }

  toViewModel(event: NostrEvent): ReactionViewModel<AccountRaw> | null;
  toViewModel(event: NostrEvent<Reaction>): ReactionViewModel<AccountRaw>;
  toViewModel(events: Array<NostrEvent>): Record<string, NostrViewModelSet<ReactionViewModel<AccountRaw>, AccountRaw>>;
  toViewModel(event: NostrEvent | Array<NostrEvent>): ReactionViewModel<AccountRaw> | Record<string, NostrViewModelSet<ReactionViewModel<AccountRaw>, AccountRaw>> | null {
    if (event instanceof Array) {
      return this.toViewModelCollection(event);
    } else if (this.guard.isKind(event, Reaction)) {
      return this.toSingleViewModel(event);
    }

    return null;
  }

  private toSingleViewModel(event: NostrEvent<Reaction>): ReactionViewModel {
    const reactedTo = this.tagHelper.listIdsFromTag('e', event);
    const author = this.profileProxy.getRawAccount(event.pubkey);

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

  private toViewModelCollection(events: Array<NostrEvent>): Record<string, NostrViewModelSet<ReactionViewModel<AccountRaw>, AccountRaw>> {
    const reactionRecord: Record<string, NostrViewModelSet<ReactionViewModel<AccountRaw>, AccountRaw>> = {};

    for (const event of events) {
      if (this.guard.isKind(event, Reaction)) {
        const sortedSet = reactionRecord[event.content] || new NostrViewModelSet<ReactionViewModel<AccountRaw>, AccountRaw>();
        const viewModel = this.toSingleViewModel(event);
        sortedSet.add(viewModel);
      }
    }

    return reactionRecord;
  }
}
