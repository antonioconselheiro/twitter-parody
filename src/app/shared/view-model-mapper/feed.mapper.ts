import { Injectable } from '@angular/core';
import { NostrEvent, NostrGuard } from '@belomonte/nostr-ngx';
import { EagerNoteViewModel } from '@view-model/eager-note.view-model';
import { FeedViewModel } from '@view-model/feed.view-model';
import { NoteViewModel } from '@view-model/note.view-model';
import { ReactionViewModel } from '@view-model/reaction.view-model';
import { RelayDomain } from '@view-model/relay-domain.type';
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

  toViewModel(event: Array<NostrEvent>, origin: Array<RelayDomain>): FeedViewModel;
  toViewModel(event: NostrEvent<ShortTextNote>, origin: Array<RelayDomain>): NoteViewModel;
  toViewModel(event: NostrEvent<Repost>, origin: Array<RelayDomain>): RepostNoteViewModel;
  toViewModel(event: NostrEvent, origin: Array<RelayDomain>): NoteViewModel | null;
  toViewModel(event: NostrEvent | Array<NostrEvent>, origin: Array<RelayDomain>): NoteViewModel | FeedViewModel | null {
    if (event instanceof Array) {
      return this.toViewModelCollection(event, origin);
    } else if (this.guard.isKind(event, ShortTextNote)) {
      return this.simpleTextMapper.toViewModel(event, origin);
    } else if (this.guard.isKind(event, Repost)) {
      return this.repostMapper.toViewModel(event, origin);
    }

    return null;
  }

  //  FIXME: split into minor methods
  // eslint-disable-next-line complexity
  private toViewModelCollection(events: Array<NostrEvent>, origin: Array<RelayDomain>, feed = new FeedViewModel(), indexOnly = false): FeedViewModel {
    for (const event of events) {
      let viewModel: EagerNoteViewModel | ReactionViewModel | null = null;
      if (this.guard.isKind(event, Repost) || this.guard.isSerializedNostrEvent(event.content)) {
        viewModel = this.repostMapper.toViewModel(event, origin);
      } else if (this.guard.isKind(event, ShortTextNote)) {
        viewModel = this.simpleTextMapper.toViewModel(event, origin);
      } else if (this.guard.isKind(event, Reaction)) {
        viewModel = this.reactionMapper.toViewModel(event, origin);
      } else if (this.guard.isKind(event, Zap)) {
        viewModel = this.zapMapper.toViewModel(event, origin);
      }

      if (viewModel) {
        if (indexOnly) { // will only index, do not add
          feed.index(viewModel);
        } else {
          feed.add(viewModel);
        }
      }
    }

    return feed;
  }

  patchViewModel(feed: FeedViewModel, events: Array<NostrEvent>, origin: Array<RelayDomain>): FeedViewModel {
    return this.toViewModelCollection(events, origin, feed);
  }

  indexViewModel(feed: FeedViewModel, events: Array<NostrEvent>, origin: Array<RelayDomain>): FeedViewModel {
    return this.toViewModelCollection(events, origin, feed, true);
  }
}
