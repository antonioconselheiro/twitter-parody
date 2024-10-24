import { Inject, Injectable } from '@angular/core';
import { MAIN_NCACHE_TOKEN, NostrEvent, NostrGuard } from '@belomonte/nostr-ngx';
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
    const idEvent = this.tweetTagsConverter.getFirstRelatedEvent(event);
    if (!idEvent) {
      console.warn('[RELAY DATA WARNING] reaction not tagged with event: ', event);
      return null;
    }

    const npub = this.nostrConverter.castPubkeyToNpub(event.pubkey);
    const npubs = [npub];

    const reaction: ReactionViewModel = {
      id: event.id,
      content: event.content,
      tweet: idEvent,
      author: npub
    };

    const lazy = this.createLazyLoadableTweetFromEventId(idEvent);
    lazy.reactions[event.id] = reaction;

    return { lazy, npubs };
  }

  private toMultipleViewModel(events: Array<NostrEvent>): Promise<Record<string, SortedNostrViewModelSet<ReactionViewModel>>> {

  }
}
