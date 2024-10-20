import { Inject, Injectable } from '@angular/core';
import { MAIN_NCACHE_TOKEN, NostrGuard } from '@belomonte/nostr-ngx';
import { NCache, NostrEvent } from '@nostrify/nostrify';
import { kinds } from 'nostr-tools';
import { Feed } from '../../view-model/feed.type';
import { RepostNoteViewModel } from '../../view-model/repost-note.view-model';
import { SimpleTextNoteViewModel } from '../../view-model/simple-text-note.view-model';
import { SortedNostrViewModelSet } from '../../view-model/sorted-nostr-view-model.set';
import { UnloadedFeedRefences } from '../../view-model/unloaded-feed-references.interface';
import { ReactionMapper } from './reaction.mapper';
import { SimpleTextMapper } from './simple-text.mapper';
import { ZapMapper } from './zap.mapper';
import { RelatedFeedAggregator } from './related-info-aggregator.interface';
import { ReactionViewModel } from 'src/app/view-model/reaction.view-model';
import { ZapViewModel } from 'src/app/view-model/zap.view-model';

@Injectable({
  providedIn: 'root'
})
export class FeedMapper {

  constructor(
    private guard: NostrGuard,
    private simpleTextMapper: SimpleTextMapper,
    private reactionMapper: ReactionMapper,
    private zapMapper: ZapMapper,
    @Inject(MAIN_NCACHE_TOKEN) private ncache: NCache
  ) { }

  toViewModel(events: Array<NostrEvent>): Promise<{
    feed: Feed;
    unloaded: UnloadedFeedRefences
  }> {
    const reactions = new Array<ReactionViewModel>();
    const zaps = new Array<ZapViewModel>();
    const aggregator: RelatedFeedAggregator = {
      feed: new SortedNostrViewModelSet<SimpleTextNoteViewModel | RepostNoteViewModel>,
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

  }

  private feedRepost(event: NostrEvent, aggregator: RelatedFeedAggregator): void {

  }

  private feedReaction(
    event: NostrEvent,
    reactions: Array<ReactionViewModel>
  ): void {

  }

  private feedZap(
    event: NostrEvent,
    zaps: Array<ZapViewModel>
  ): void {

  }

  private fetchFeed(
    aggregator: RelatedFeedAggregator,
    reactions: Array<ReactionViewModel>,
    zaps: Array<ZapViewModel>
  ): RelatedFeedAggregator {
    //  TODO: implement this
    return aggregator;
  }
}
