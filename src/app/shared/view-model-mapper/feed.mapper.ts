import { Injectable } from '@angular/core';
import { Account, AccountRaw, NostrEvent, NostrGuard } from '@belomonte/nostr-ngx';
import { FeedViewModel } from '@view-model/feed.view-model';
import { NoteViewModel } from '@view-model/note.view-model';
import { ReactionViewModel } from '@view-model/reaction.view-model';
import { RepostNoteViewModel } from '@view-model/repost-note.view-model';
import { ZapViewModel } from '@view-model/zap.view-model';
import { Reaction, Repost, ShortTextNote, Zap } from 'nostr-tools/kinds';
import { ReactionMapper } from './reaction.mapper';
import { RepostMapper } from './repost.mapper';
import { SimpleTextMapper } from './simple-text.mapper';
import { ViewModelPatch } from './view-model-patch.mapper';
import { ViewModelMapper } from './view-model.mapper';
import { ZapMapper } from './zap.mapper';
import { NostrViewModelSet } from '@view-model/nostr-view-model.set';

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

  toViewModel(event: Array<NostrEvent>): FeedViewModel<Account>;
  toViewModel(event: NostrEvent<ShortTextNote>): NoteViewModel<Account>;
  toViewModel(event: NostrEvent<Repost>): RepostNoteViewModel<Account>;
  toViewModel(event: NostrEvent): NoteViewModel<Account> | null;
  toViewModel(event: NostrEvent | Array<NostrEvent>): NoteViewModel<Account> | FeedViewModel<Account> | null {
    if (event instanceof Array) {
      return this.toViewModelCollection(event);
    } else if (this.guard.isKind(event, ShortTextNote)) {
      return this.simpleTextMapper.toViewModel(event);
    } else if (this.guard.isKind(event, Repost)) {
      return this.repostMapper.toViewModel(event);
    }

    return null;
  }

  //  FIXME: split into minor methods
  // eslint-disable-next-line complexity
  private toViewModelCollection(events: Array<NostrEvent>, feed = new NostrViewModelSet<NoteViewModel>()): FeedViewModel {
    const reactions = new Map<string, Array<ReactionViewModel>>();
    const zaps = new Map<string, Array<ZapViewModel>>();

    for (const event of events) {
      if (this.guard.isKind(event, Repost) || this.guard.isSerializedNostrEvent(event.content)) {
        const viewModel = this.repostMapper.toViewModel(event);
        feed.add(viewModel);
      } else if (this.guard.isKind(event, ShortTextNote)) {
        const viewModel = this.simpleTextMapper.toViewModel(event);
        feed.add(viewModel);
      } else if (this.guard.isKind(event, Reaction)) {
        const viewModel = this.reactionMapper.toViewModel(event);
        if (viewModel) {
          viewModel.reactedTo.forEach(idHex => {
            const reactionList = reactions.get(idHex) || new Array<ReactionViewModel>();
            reactionList.push(viewModel);
          });
        }
      } else if (this.guard.isKind(event, Zap)) {
        const viewModel = this.zapMapper.toViewModel(event);
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

      viewModel.zaps = new NostrViewModelSet<ZapViewModel, AccountRaw>();
      viewModel.reactions = {};

      zapList.forEach(zap => viewModel.zaps.add(zap));
      reactionList.forEach(reaction => {
        let list: NostrViewModelSet<ReactionViewModel, AccountRaw>;
        if (!viewModel.reactions[reaction.content]) {
          list = viewModel.reactions[reaction.content] = new NostrViewModelSet<ReactionViewModel, AccountRaw>();
        } else {
          list = viewModel.reactions[reaction.content];
        }

        list.add(reaction);
      });
    });

    return feed;
  }

  patchViewModel(feed: FeedViewModel<Account>, events: Array<NostrEvent>): FeedViewModel<Account> {
    return this.toViewModelCollection(events, feed);
  }
}
