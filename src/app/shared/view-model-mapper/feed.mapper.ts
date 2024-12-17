import { Injectable } from '@angular/core';
import { NostrEvent, NostrGuard } from '@belomonte/nostr-ngx';
import { FeedViewModel } from '@view-model/feed.view-model';
import { NoteViewModel } from '@view-model/note.view-model';
import { ReactionViewModel } from '@view-model/reaction.view-model';
import { RepostNoteViewModel } from '@view-model/repost-note.view-model';
import { SortedNostrViewModelSet } from '@view-model/sorted-nostr-view-model.set';
import { ZapViewModel } from '@view-model/zap.view-model';
import { Reaction, Repost, ShortTextNote, Zap } from 'nostr-tools/kinds';
import { ReactionMapper } from './reaction.mapper';
import { RepostMapper } from './repost.mapper';
import { SimpleTextMapper } from './simple-text.mapper';
import { ViewModelPatch } from './view-model-patch.mapper';
import { ViewModelMapper } from './view-model.mapper';
import { ZapMapper } from './zap.mapper';

@Injectable({
  providedIn: 'root'
})
export class FeedMapper implements ViewModelMapper<NoteViewModel, FeedViewModel>, ViewModelPatch<FeedViewModel> {

  constructor(
    private guard: NostrGuard,
    private repostMapper: RepostMapper,
    private simpleTextMapper: SimpleTextMapper,
    private reactionMapper: ReactionMapper,
    private zapMapper: ZapMapper
  ) { }

  toViewModel(event: NostrEvent<ShortTextNote>): Promise<NoteViewModel>;
  toViewModel(event: NostrEvent<Repost>): Promise<RepostNoteViewModel>;
  toViewModel(event: NostrEvent): Promise<NoteViewModel | null>;
  toViewModel(event: Array<NostrEvent>): Promise<FeedViewModel>;
  toViewModel(event: NostrEvent | Array<NostrEvent>): Promise<NoteViewModel | FeedViewModel | null> {
    if (event instanceof Array) {
      return this.toMultipleViewModel(event);
    } else if (this.guard.isKind(event, ShortTextNote)) {
      return this.simpleTextMapper.toViewModel(event);
    } else if (this.guard.isKind(event, Repost)) {
      return this.repostMapper.toViewModel(event);
    }

    return Promise.resolve(null);
  }

  // eslint-disable-next-line complexity
  private async toMultipleViewModel(events: Array<NostrEvent>, feed = new SortedNostrViewModelSet<NoteViewModel>()): Promise<FeedViewModel> {
    const reactions = new Map<string, Array<ReactionViewModel>>();
    const zaps = new Map<string, Array<ZapViewModel>>();

    for await (const event of events) {
      if (this.guard.isKind(event, ShortTextNote)) {
        const viewModel = await this.simpleTextMapper.toViewModel(event);
        feed.add(viewModel);
      } else if (this.guard.isKind(event, Repost)) {
        const viewModel = await this.repostMapper.toViewModel(event);
        feed.add(viewModel);
      } else if (this.guard.isKind(event, Reaction)) {
        const viewModel = await this.reactionMapper.toViewModel(event);
        if (viewModel) {
          viewModel.reactedTo.forEach(idHex => {
            const reactionList = reactions.get(idHex) || new Array<ReactionViewModel>();
            reactionList.push(viewModel);
          });
        }
      } else if (this.guard.isKind(event, Zap)) {
        const viewModel = await this.zapMapper.toViewModel(event);
        if (viewModel) {
          viewModel.reactedTo.forEach(idHex => {
            const reactionList = reactions.get(idHex) || new Array<ZapViewModel>();
            reactionList.push(viewModel);
          });
        }
      }
    }

    return this.fetchFeed(feed, reactions, zaps);
  }

  private fetchFeed(
    feed: FeedViewModel,
    reactions: Map<string, Array<ReactionViewModel>>,
    zaps: Map<string, Array<ZapViewModel>>
  ): FeedViewModel {
    [...feed].forEach(viewModel => {
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

    return feed;
  }

  patchViewModel(feed: FeedViewModel, events: Array<NostrEvent>): Promise<FeedViewModel> {
    return this.toMultipleViewModel(events, feed);
  }
}
