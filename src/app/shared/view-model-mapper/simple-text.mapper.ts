import { Inject, Injectable } from '@angular/core';
import { Account, InMemoryNCache, LOCAL_CACHE_TOKEN, NostrEvent, NostrGuard, ProfileProxy } from '@belomonte/nostr-ngx';
import { HTML_PARSER_TOKEN } from '@shared/htmlfier/html-parser.token';
import { NoteHtmlfier } from '@shared/htmlfier/note-htmlfier.interface';
import { NoteReplyContext } from '@view-model/context/note-reply-context.interface';
import { NoteViewModel } from '@view-model/note.view-model';
import { SimpleTextNoteViewModel } from '@view-model/simple-text-note.view-model';
import { SortedNostrViewModelSet } from '@view-model/sorted-nostr-view-model.set';
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
    @Inject(LOCAL_CACHE_TOKEN) private ncache: InMemoryNCache,
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

    const events = this.ncache.syncQuery([
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
    //  FIXME: o mapper não deve fazer requisições websocket, devo bolar uma maneira de fazer o carregamento o account
    //  utilizando somente as informações disponíveis em cache
    const author = this.profileProxy.getAccount(event.pubkey);
    const reply: NoteReplyContext<Account> = { replies: new SortedNostrViewModelSet<NoteViewModel<Account>>() };
    const note: SimpleTextNoteViewModel<Account> = {
      id: event.id,
      author,
      event: event,
      createdAt: event.created_at,
      content: this.htmlfier.parse(event.content),
      media: this.htmlfier.extractMedia(event.content),
      reactions,
      zaps,
      reply,
      //  TODO: ideally I should pass relay address from where this event come
      origin: [],
      reposted: new SortedNostrViewModelSet<NoteViewModel<Account>>()
    };

    return note;
  }
}
