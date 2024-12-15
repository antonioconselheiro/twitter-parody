import { Inject, Injectable } from '@angular/core';
import { InMemoryNCache, LOCAL_CACHE_TOKEN, NostrEvent, NostrGuard, ProfileService } from '@belomonte/nostr-ngx';
import { HTML_PARSER_TOKEN } from '@shared/htmlfier/html-parser.token';
import { NoteHtmlfier } from '@shared/htmlfier/note-htmlfier.interface';
import { NoteReplyContext } from '@view-model/context/note-reply-context.interface';
import { NoteViewModel } from '@view-model/note.view-model';
import { SimpleTextNoteViewModel } from '@view-model/simple-text-note.view-model';
import { SortedNostrViewModelSet } from '@view-model/sorted-nostr-view-model.set';
import { Reaction, Repost, ShortTextNote, Zap } from 'nostr-tools/kinds';
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
    private profileService: ProfileService,
    private reactionMapper: ReactionMapper,
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
          ShortTextNote,
          Repost,
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
    const author = await this.profileService.loadAccount(event.pubkey);
    const reply: NoteReplyContext = { replies: new SortedNostrViewModelSet<NoteViewModel>() };
    const note: SimpleTextNoteViewModel = {
      id: event.id,
      author,
      origin: event,
      createdAt: event.created_at,
      content: this.htmlfier.parse(event.content),
      media: this.htmlfier.extractMedia(event.content),
      reactions,
      zaps,
      reply,
      reposted: new SortedNostrViewModelSet<NoteViewModel>()
    };

    return note;
  }
}
