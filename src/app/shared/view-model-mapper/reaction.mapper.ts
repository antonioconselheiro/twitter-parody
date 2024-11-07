import { Injectable } from '@angular/core';
import { NostrEvent, NostrGuard } from '@belomonte/nostr-ngx';
import { ReactionViewModel } from '@view-model/reaction.view-model';
import { SortedNostrViewModelSet } from '@view-model/sorted-nostr-view-model.set';
import { Reaction } from 'nostr-tools/kinds';
import { TagHelper } from './tag.helper';
import { ViewModelMapper } from './view-model.mapper';

@Injectable({
  providedIn: 'root'
})
export class ReactionMapper implements ViewModelMapper<ReactionViewModel, Record<string, SortedNostrViewModelSet<ReactionViewModel>>> {

  constructor(
    private tagHelper: TagHelper,
    private guard: NostrGuard
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
    const reactedTo = this.tagHelper.listIdsFromTag('e', event);

    return Promise.resolve({
      id: event.id,
      content: event.content,
      reactedTo,
      author: event.pubkey,
      createdAt: event.created_at
    });
  }

  private async toMultipleViewModel(events: Array<NostrEvent>): Promise<Record<string, SortedNostrViewModelSet<ReactionViewModel>>> {
    const reactionRecord: Record<string, SortedNostrViewModelSet<ReactionViewModel>> = {};

    for await (const event of events) {
      if (this.guard.isKind(event, Reaction)) {
        const sortedSet = reactionRecord[event.content] || new SortedNostrViewModelSet<ReactionViewModel>();
        const viewModel = await this.toSingleViewModel(event);
        sortedSet.add(viewModel);
      }
    }

    return Promise.resolve(reactionRecord);
  }
}
