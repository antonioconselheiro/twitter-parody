import { Inject, Injectable } from '@angular/core';
import { InMemoryNCache, LOCAL_CACHE_TOKEN, NostrEvent, NostrGuard, ProfileProxy } from '@belomonte/nostr-ngx';
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

  async toViewModel(event: NostrEvent<ShortTextNote>): Promise<NoteViewModel>;
  async toViewModel(event: NostrEvent): Promise<NoteViewModel | null>;
  async toViewModel(event: NostrEvent): Promise<NoteViewModel | null> {
    if (!this.guard.isKind(event, ShortTextNote)) {
      return null;
    }

    const events = await this.ncache.query([
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

    const reactions = await this.reactionMapper.toViewModel(events);
    const zaps = await this.zapMapper.toViewModel(events);
    //  FIXME: o mapper não deve fazer requisições websocket, devo bolar uma maneira de fazer o carregamento o account
    //  utilizando somente as informações disponíveis em cache
    const author = await this.profileProxy.loadAccount(event.pubkey, 'viewable');
    const reply: NoteReplyContext = { replies: new SortedNostrViewModelSet<NoteViewModel>() };
    const note: SimpleTextNoteViewModel = {
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
      reposted: new SortedNostrViewModelSet<NoteViewModel>()
    };

    return note;
  }
}
