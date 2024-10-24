import { Inject, Injectable } from '@angular/core';
import { Account, MAIN_NCACHE_TOKEN, NostrEvent, NostrGuard } from '@belomonte/nostr-ngx';
import { NCache } from '@nostrify/nostrify';
import { ReactionViewModel } from '@view-model/reaction.view-model';
import { FeedAggregator } from '@view-model/feed-aggregator.interface';
import { RepostNoteViewModel } from '@view-model/repost-note.view-model';
import { SimpleTextNoteViewModel } from '@view-model/simple-text-note.view-model';
import { SortedNostrViewModelSet } from '@view-model/sorted-nostr-view-model.set';
import { ZapViewModel } from '@view-model/zap.view-model';
import { Repost, ShortTextNote } from 'nostr-tools/kinds';
import { RepostMapper } from './repost.mapper';
import { SimpleTextMapper } from './simple-text.mapper';
import { ViewModelMapper } from './view-model.mapper';

@Injectable({
  providedIn: 'root'
})
export class FeedMapper implements ViewModelMapper<SimpleTextNoteViewModel | RepostNoteViewModel, FeedAggregator> {

  constructor(
    private guard: NostrGuard,
    private repostMapper: RepostMapper,
    private simpleTextMapper: SimpleTextMapper,
    @Inject(MAIN_NCACHE_TOKEN) private ncache: NCache
  ) { }

  toViewModel(event: NostrEvent<ShortTextNote>): Promise<SimpleTextNoteViewModel | RepostNoteViewModel>;
  toViewModel(event: NostrEvent<Repost>): Promise<RepostNoteViewModel>;
  toViewModel(event: NostrEvent): Promise<SimpleTextNoteViewModel | RepostNoteViewModel | null>;
  toViewModel(event: Array<NostrEvent>): Promise<FeedAggregator>;
  toViewModel(event: NostrEvent | Array<NostrEvent>): Promise<SimpleTextNoteViewModel | RepostNoteViewModel | FeedAggregator | null> {
    if (event instanceof Array) {
      return this.toMultipleViewModel(event);
    } else if (this.guard.isKind(event, ShortTextNote)) {
      return this.simpleTextMapper.toViewModel(event);
    } else if (this.guard.isKind(event, Repost)) {
      return this.repostMapper.toViewModel(event);
    }

    return Promise.resolve(null);
  }

  private async toMultipleViewModel(events: Array<NostrEvent>): Promise<FeedAggregator> {
    const reactions = new Map<string, Array<ReactionViewModel>>();
    const zaps = new Map<string, Array<ZapViewModel>>();
    const aggregator: FeedAggregator = {
      feed: new SortedNostrViewModelSet<SimpleTextNoteViewModel | RepostNoteViewModel>(),
      accounts: new Set<Account>(),
      unloaded: {
        idevent: [],
        pubkey: []
      }
    };

    for await (const event of events) {
      if (this.guard.isKind(event, ShortTextNote)) {
        await this.feedSimpleText(event, aggregator);
      } else if (this.guard.isKind(event, Repost)) {
        await this.feedRepost(event, aggregator);
      }
    }

    return this.fetchFeed(aggregator, reactions, zaps);
  }

  private async feedSimpleText(event: NostrEvent<ShortTextNote>, aggregator: FeedAggregator): Promise<void> {
    const viewModel = await this.simpleTextMapper.toViewModel(event);
    aggregator.feed.add(viewModel);
  }

  private async feedRepost(event: NostrEvent<Repost>, aggregator: FeedAggregator): Promise<void> {
    const viewModel = await this.repostMapper.toViewModel(event);
    aggregator.feed.add(viewModel);
  }

  private fetchFeed(
    aggregator: FeedAggregator,
    reactions: Map<string, Array<ReactionViewModel>>,
    zaps: Map<string, Array<ZapViewModel>>
  ): FeedAggregator {
    [...aggregator.feed].forEach(viewModel => {
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
