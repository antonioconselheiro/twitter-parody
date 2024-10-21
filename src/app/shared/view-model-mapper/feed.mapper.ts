import { Inject, Injectable } from '@angular/core';
import { Account, MAIN_NCACHE_TOKEN, NostrGuard } from '@belomonte/nostr-ngx';
import { NCache, NostrEvent } from '@nostrify/nostrify';
import { kinds } from 'nostr-tools';
import { ReactionViewModel } from '../../view-model/reaction.view-model';
import { RelatedFeedAggregator } from '../../view-model/related-info-aggregator.interface';
import { RepostNoteViewModel } from '../../view-model/repost-note.view-model';
import { SimpleTextNoteViewModel } from '../../view-model/simple-text-note.view-model';
import { SortedNostrViewModelSet } from '../../view-model/sorted-nostr-view-model.set';
import { ZapViewModel } from '../../view-model/zap.view-model';
import { ReactionMapper } from './reaction.mapper';
import { RepostMapper } from './repost.mapper';
import { SimpleTextMapper } from './simple-text.mapper';
import { ZapMapper } from './zap.mapper';

@Injectable({
  providedIn: 'root'
})
export class FeedMapper {

  constructor(
    private guard: NostrGuard,
    private zapMapper: ZapMapper,
    private repostMapper: RepostMapper,
    private reactionMapper: ReactionMapper,
    private simpleTextMapper: SimpleTextMapper,
    @Inject(MAIN_NCACHE_TOKEN) private ncache: NCache
  ) { }

  toViewModel(events: Array<NostrEvent>): RelatedFeedAggregator {
    const reactions = new Map<string, Array<ReactionViewModel>>();
    const zaps = new Map<string, Array<ZapViewModel>>();
    const aggregator: RelatedFeedAggregator = {
      feed: new SortedNostrViewModelSet<SimpleTextNoteViewModel | RepostNoteViewModel>(),
      referenced: new Map<string, SimpleTextNoteViewModel | RepostNoteViewModel>(),
      accounts: new Set<Account>(),
      unloaded: {
        pubkey: [],
        idevent: []
      }
    };

    events.forEach(event => {
      if (this.guard.isKind(event, kinds.ShortTextNote)) {
        this.feedSimpleText(event, aggregator);
      } else if (this.guard.isKind(event, kinds.Repost)) {
        this.feedRepost(event, aggregator);
      } else if (this.guard.isKind(event, kinds.Reaction)) {
        this.feedReaction(event, reactions);
      } else if (this.guard.isKind(event, kinds.Zap)) {
        this.feedZap(event, zaps);
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

  private feedReaction(
    event: NostrEvent,
    reactions: Map<string, Array<ReactionViewModel>>
  ): void {
    const viewModel = this.reactionMapper.toViewModel(event);
    viewModel.reactedTo.forEach(eventId => {
      const list = reactions.get(eventId) || new Array<ReactionViewModel>();
      list.push(viewModel);
    });
  }

  private feedZap(
    event: NostrEvent,
    zaps: Map<string, Array<ZapViewModel>>
  ): void {
    const viewModel = this.zapMapper.toViewModel(event);
    viewModel.reactedTo.forEach(eventId => {
      const list = zaps.get(eventId) || new Array<ZapViewModel>();
      list.push(viewModel);
    });
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
