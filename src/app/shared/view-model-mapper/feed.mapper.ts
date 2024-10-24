import { Inject, Injectable } from '@angular/core';
import { Account, MAIN_NCACHE_TOKEN, NostrEvent, NostrGuard } from '@belomonte/nostr-ngx';
import { NCache } from '@nostrify/nostrify';
import { ReactionViewModel } from '@view-model/reaction.view-model';
import { RelatedFeedAggregator } from '@view-model/related-info-aggregator.interface';
import { RepostNoteViewModel } from '@view-model/repost-note.view-model';
import { SimpleTextNoteViewModel } from '@view-model/simple-text-note.view-model';
import { SortedNostrViewModelSet } from '@view-model/sorted-nostr-view-model.set';
import { ZapViewModel } from '@view-model/zap.view-model';
import { kinds } from 'nostr-tools';
import { RepostMapper } from './repost.mapper';
import { SimpleTextMapper } from './simple-text.mapper';
import { ViewModelMapper } from './view-model.mapper';
import { Repost, ShortTextNote } from 'nostr-tools/kinds';

@Injectable({
  providedIn: 'root'
})
export class FeedMapper implements ViewModelMapper<SimpleTextNoteViewModel | RepostNoteViewModel, RelatedFeedAggregator> {

  constructor(
    private guard: NostrGuard,
    private repostMapper: RepostMapper,
    private simpleTextMapper: SimpleTextMapper,
    @Inject(MAIN_NCACHE_TOKEN) private ncache: NCache
  ) { }

  toViewModel(event: NostrEvent): Promise<SimpleTextNoteViewModel | RepostNoteViewModel>;
  toViewModel(event: Array<NostrEvent>): Promise<RelatedFeedAggregator>;
  toViewModel(event: NostrEvent | Array<NostrEvent>): Promise<SimpleTextNoteViewModel | RepostNoteViewModel | RelatedFeedAggregator> {
    if (event instanceof Array) {
      return this.toMultipleViewModel(event);
    } else {
      return this.toSingleViewModel(event);
    }
  }

  toViewModel(events: Array<NostrEvent>): RelatedFeedAggregator {
    const reactions = new Map<string, Array<ReactionViewModel>>();
    const zaps = new Map<string, Array<ZapViewModel>>();
    const aggregator: RelatedFeedAggregator = {
      feed: new SortedNostrViewModelSet<SimpleTextNoteViewModel | RepostNoteViewModel>(),
      accounts: new Set<Account>(),
      unloaded: {
        pubkey: [],
        idevent: []
      }
    };

    events.forEach(event => {
      if (this.guard.isKind(event, ShortTextNote)) {
        this.feedSimpleText(event, aggregator);
      } else if (this.guard.isKind(event, Repost)) {
        this.feedRepost(event, aggregator);
      }
    });

    return this.fetchFeed(aggregator, reactions, zaps);
  }

  private feedSimpleText(event: NostrEvent, aggregator: RelatedFeedAggregator): void {
    const viewModel = this.simpleTextMapper.toViewModel(event);
    aggregator.feed.add(viewModel);
  }

  private feedRepost(event: NostrEvent, aggregator: RelatedFeedAggregator): void {
    const viewModel = this.repostMapper.toViewModel(event);
    aggregator.feed.add(viewModel);
  }

  private fetchFeed(
    aggregator: RelatedFeedAggregator,
    reactions: Map<string, Array<ReactionViewModel>>,
    zaps: Map<string, Array<ZapViewModel>>
  ): RelatedFeedAggregator {
    [...aggregator.feed, ...aggregator.referenced.values()].forEach(viewModel => {
      const zapList = zaps.get(viewModel.id) || [];
      const reactionList = reactions.get(viewModel.id) || [];

      viewModel.zaps = new SortedNostrViewModelSet<ZapViewModel>();
      viewModel.reactions = {};

      zapList.forEach(zap => viewModel.zaps.add(zap));
      reactionList.forEach(reaction => {
        let sorted: SortedNostrViewModelSet<ReactionViewModel>;
        if (!viewModel.reactions[reaction.content]) {
          sorted = viewModel.reactions[reaction.content] = new SortedNostrViewModelSet<ReactionViewModel>();
        } else {
          sorted = viewModel.reactions[reaction.content];
        }

        sorted.add(reaction);
      });
    });

    return aggregator;
  }
}
