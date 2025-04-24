import { Injectable } from '@angular/core';
import { NostrEvent, NostrGuard, ProfileProxy } from '@belomonte/nostr-ngx';
import { NostrViewModelSet } from '@view-model/nostr-view-model.set';
import { ReactionViewModel } from '@view-model/reaction.view-model';
import { Reaction } from 'nostr-tools/kinds';
import { TagHelper } from './tag.helper';
import { ViewModelMapper } from './view-model.mapper';

@Injectable({
  providedIn: 'root'
})
export class ReactionMapper implements ViewModelMapper<ReactionViewModel, Record<string, NostrViewModelSet<ReactionViewModel>>> {

  constructor(
    private tagHelper: TagHelper,
    private profileProxy: ProfileProxy,
    private guard: NostrGuard
  ) { }

  toViewModel(event: NostrEvent): ReactionViewModel | null;
  toViewModel(event: NostrEvent<Reaction>): ReactionViewModel;
  toViewModel(events: Array<NostrEvent>): Record<string, NostrViewModelSet<ReactionViewModel>>;
  toViewModel(event: NostrEvent | Array<NostrEvent>): ReactionViewModel | Record<string, NostrViewModelSet<ReactionViewModel>> | null {
    if (event instanceof Array) {
      return this.toViewModelCollection(event);
    } else if (this.guard.isKind(event, Reaction)) {
      return this.toSingleViewModel(event);
    }

    return null;
  }

  private toSingleViewModel(event: NostrEvent<Reaction>): ReactionViewModel {
    const reactedTo = this.tagHelper.listIdsFromTag('e', event);
    const relates = this.tagHelper.getRelatedEvents(event).map(([event]) => event)
    const author = this.profileProxy.getRawAccount(event.pubkey);

    return {
      id: event.id,
      content: event.content,
      reactedTo,
      event,
      author,
      //  TODO: ideally I should pass relay address from where this event come
      origin: [],
      relates,
      createdAt: event.created_at
    };
  }

  private toViewModelCollection(events: Array<NostrEvent>): Record<string, NostrViewModelSet<ReactionViewModel>> {
    const reactionRecord: Record<string, NostrViewModelSet<ReactionViewModel>> = {};

    for (const event of events) {
      if (this.guard.isKind(event, Reaction)) {
        const sortedSet = reactionRecord[event.content] || new NostrViewModelSet<ReactionViewModel>();
        const viewModel = this.toSingleViewModel(event);
        sortedSet.add(viewModel);
      }
    }

    return reactionRecord;
  }
}
