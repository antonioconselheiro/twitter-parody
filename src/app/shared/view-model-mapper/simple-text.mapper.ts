import { Inject, Injectable } from '@angular/core';
import { Account, NOSTR_CACHE_TOKEN, NostrCache, NostrEvent, NostrGuard, ProfileProxy } from '@belomonte/nostr-ngx';
import { HTML_PARSER_TOKEN } from '@shared/htmlfier/html-parser.token';
import { NoteHtmlfier } from '@shared/htmlfier/note-htmlfier.interface';
import { NoteReplyContext } from '@view-model/context/note-reply-context.interface';
import { NostrViewModelSet } from '@view-model/nostr-view-model.set';
import { NoteViewModel } from '@view-model/note.view-model';
import { SimpleTextNoteViewModel } from '@view-model/simple-text-note.view-model';
import { Reaction, ShortTextNote, Zap } from 'nostr-tools/kinds';
import { ReactionMapper } from './reaction.mapper';
import { SingleViewModelMapper } from './single-view-model.mapper';
import { ZapMapper } from './zap.mapper';

@Injectable({
  providedIn: 'root'
})
export class SimpleTextMapper implements SingleViewModelMapper<NoteViewModel> {

  constructor(
    @Inject(HTML_PARSER_TOKEN) private htmlfier: NoteHtmlfier,
    @Inject(NOSTR_CACHE_TOKEN) private nostrCache: NostrCache,
    private reactionMapper: ReactionMapper,
    private profileProxy: ProfileProxy,
    private zapMapper: ZapMapper,
    private guard: NostrGuard
  ) { }

  toViewModel(event: NostrEvent<ShortTextNote>): NoteViewModel;
  toViewModel(event: NostrEvent): NoteViewModel | null;
  toViewModel(event: NostrEvent): NoteViewModel | null {
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
    const author = this.profileProxy.getAccount(event.pubkey);
    const reply: NoteReplyContext = { replies: new NostrViewModelSet<NoteViewModel>() };
    const note: SimpleTextNoteViewModel<Account> = {
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
      reposted: new NostrViewModelSet<NoteViewModel>(),
      mentioned: new NostrViewModelSet<NoteViewModel>()
    };

    return note;
  }
}
