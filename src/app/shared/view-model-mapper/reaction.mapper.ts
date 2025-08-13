import { Injectable } from '@angular/core';
import { NostrEvent, NostrGuard, ProfileProxy } from '@belomonte/nostr-ngx';
import { NostrViewModelSet } from '@view-model/nostr-view-model.set';
import { ReactionViewModel } from '@view-model/reaction.view-model';
import { Reaction } from 'nostr-tools/kinds';
import { TagHelper } from './tag.helper';
import { ViewModelMapper } from './view-model.mapper';
import { RelayDomain } from '@view-model/relay-domain.type';
import { nip19 } from 'nostr-tools';

@Injectable({
  providedIn: 'root'
})
export class ReactionMapper implements ViewModelMapper<ReactionViewModel, Record<string, NostrViewModelSet<ReactionViewModel>>> {

  constructor(
    private tagHelper: TagHelper,
    private profileProxy: ProfileProxy,
    private guard: NostrGuard
  ) { }

  toViewModel(event: NostrEvent, origin: Array<RelayDomain>): ReactionViewModel | null;
  toViewModel(event: NostrEvent<Reaction>, origin: Array<RelayDomain>): ReactionViewModel;
  toViewModel(events: Array<NostrEvent>, origin: Array<RelayDomain>): Record<string, NostrViewModelSet<ReactionViewModel>>;
  toViewModel(event: NostrEvent | Array<NostrEvent>, origin: Array<RelayDomain>): ReactionViewModel | Record<string, NostrViewModelSet<ReactionViewModel>> | null {
    if (event instanceof Array) {
      return this.toViewModelCollection(event, origin);
    } else if (this.guard.isKind(event, Reaction)) {
      return this.toSingleViewModel(event, origin);
    }

    return null;
  }

  private toSingleViewModel(event: NostrEvent<Reaction>, origin: Array<RelayDomain>): ReactionViewModel {
    const reactedTo = this.tagHelper.listIdsFromTag('e', event);
    const relates = this.tagHelper.getRelatedEvents(event).map(([event]) => event)
    const author = this.profileProxy.getRawAccount(event.pubkey);

    const note = nip19.noteEncode(event.id);
    const nevent = nip19.neventEncode({
      id: event.id,
      author: event.pubkey,
      kind: event.kind,
      relays: origin
    });

    return {
      id: event.id,
      note,
      nevent,
      content: event.content,
      reactedTo,
      event,
      author,
      origin,
      relates,
      createdAt: event.created_at
    };
  }

  private toViewModelCollection(events: Array<NostrEvent>, origin: Array<RelayDomain>): Record<string, NostrViewModelSet<ReactionViewModel>> {
    const reactionRecord: Record<string, NostrViewModelSet<ReactionViewModel>> = {};

    for (const event of events) {
      if (this.guard.isKind(event, Reaction)) {
        const sortedSet = reactionRecord[event.content] || new NostrViewModelSet<ReactionViewModel>();
        const viewModel = this.toSingleViewModel(event, origin);
        sortedSet.add(viewModel);
      }
    }

    return reactionRecord;
  }
}
