import { Injectable } from '@angular/core';
import { Account, NostrEvent, NostrGuard } from '@belomonte/nostr-ngx';
import { EagerNoteViewModel } from '@view-model/eager-note.view-model';
import { FeedViewModel } from '@view-model/feed.view-model';
import { NoteViewModel } from '@view-model/note.view-model';
import { ReactionViewModel } from '@view-model/reaction.view-model';
import { RepostNoteViewModel } from '@view-model/repost-note.view-model';
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
  private toViewModelCollection(events: Array<NostrEvent>, feed = new FeedViewModel()): FeedViewModel {
    for (const event of events) {
      let viewModel: EagerNoteViewModel<Account> | ReactionViewModel | null = null;
      if (this.guard.isKind(event, Repost) || this.guard.isSerializedNostrEvent(event.content)) {
        viewModel = this.repostMapper.toViewModel(event);
      } else if (this.guard.isKind(event, ShortTextNote)) {
        viewModel = this.simpleTextMapper.toViewModel(event);
      } else if (this.guard.isKind(event, Reaction)) {
        viewModel = this.reactionMapper.toViewModel(event);
      } else if (this.guard.isKind(event, Zap)) {
        viewModel = this.zapMapper.toViewModel(event);
      }

      if (viewModel) {
        feed.add(viewModel);
      }
    }

    return feed;
  }

  patchViewModel(feed: FeedViewModel<Account>, events: Array<NostrEvent>): FeedViewModel<Account> {
    return this.toViewModelCollection(events, feed);
  }
}
