import { Inject, Injectable } from '@angular/core';
import { NOSTR_CACHE_TOKEN, NostrCache, NostrEvent, NostrGuard, ProfileProxy } from '@belomonte/nostr-ngx';
import { HTML_PARSER_TOKEN } from '@shared/htmlfier/html-parser.token';
import { NoteHtmlfier } from '@shared/htmlfier/note-htmlfier.interface';
import { NoteReplyContext } from '@view-model/context/note-reply-context.interface';
import { EagerNoteViewModel } from '@view-model/eager-note.view-model';
import { LazyNoteViewModel } from '@view-model/lazy-note.view-model';
import { NostrViewModelSet } from '@view-model/nostr-view-model.set';
import { SimpleTextNoteViewModel } from '@view-model/simple-text-note.view-model';
import { Reaction, ShortTextNote, Zap } from 'nostr-tools/kinds';
import { ReactionMapper } from './reaction.mapper';
import { SingleViewModelMapper } from './single-view-model.mapper';
import { ZapMapper } from './zap.mapper';

@Injectable({
  providedIn: 'root'
})
export class SimpleTextMapper implements SingleViewModelMapper<EagerNoteViewModel> {

  constructor(
    @Inject(HTML_PARSER_TOKEN) private htmlfier: NoteHtmlfier,
    @Inject(NOSTR_CACHE_TOKEN) private nostrCache: NostrCache,
    private reactionMapper: ReactionMapper,
    private profileProxy: ProfileProxy,
    private zapMapper: ZapMapper,
    private guard: NostrGuard
  ) { }

  toViewModel(event: NostrEvent<ShortTextNote>): EagerNoteViewModel;
  toViewModel(event: NostrEvent): EagerNoteViewModel | null;
  toViewModel(event: NostrEvent): EagerNoteViewModel | null {
    if (!this.guard.isKind(event, ShortTextNote)) {
      return null;
    }

    const events = this.nostrCache.syncQuery([
      {
        kinds: [
          Reaction,
          Zap
        ],
        '#e': [
          event.id
        ]
      }
    ]);

    const reactions = this.reactionMapper.toViewModel(events);
    const zaps = this.zapMapper.toViewModel(events);
    const author = this.profileProxy.getRawAccount(event.pubkey);
    const reply: NoteReplyContext = { replies: new NostrViewModelSet<LazyNoteViewModel>() };
    const note: SimpleTextNoteViewModel = {
      id: event.id,
      author,
      event,
      createdAt: event.created_at,
      content: this.htmlfier.parse(event.content),
      media: this.htmlfier.extractMedia(event.content),
      reactions,
      zaps,
      reply,
      //  TODO: ideally I should pass relay address from where this event come
      origin: [],
      reposted: new NostrViewModelSet<LazyNoteViewModel>(),
      mentioned: new NostrViewModelSet<LazyNoteViewModel>()
    };

    return note;
  }
}
