import { Inject, Injectable } from '@angular/core';
import { InMemoryNCache, LOCAL_CACHE_TOKEN, NostrEvent, NostrGuard, ProfileService } from '@belomonte/nostr-ngx';
import { HTML_PARSER_TOKEN } from '@shared/htmlfier/html-parser.token';
import { NoteHtmlfier } from '@shared/htmlfier/note-htmlfier.interface';
import { NoteViewModel } from '@view-model/note.view-model';
import { SimpleTextNoteViewModel } from '@view-model/simple-text-note.view-model';
import { Reaction, Repost, ShortTextNote, Zap } from 'nostr-tools/kinds';
import { AbstractNoteMapper } from './abstract-note.mapper';
import { ReactionMapper } from './reaction.mapper';
import { SingleViewModelMapper } from './single-view-model.mapper';
import { TagHelper } from './tag.helper';
import { ZapMapper } from './zap.mapper';

@Injectable({
  providedIn: 'root'
})
export class SimpleTextMapper extends AbstractNoteMapper implements SingleViewModelMapper<NoteViewModel> {

  constructor(
    @Inject(HTML_PARSER_TOKEN) private htmlfier: NoteHtmlfier,
    @Inject(LOCAL_CACHE_TOKEN) private ncache: InMemoryNCache,
    private profileService: ProfileService,
    private reactionMapper: ReactionMapper,
    private zapMapper: ZapMapper,
    protected tagHelper: TagHelper,
    protected guard: NostrGuard
  ) {
    super();
  }

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
    const note: SimpleTextNoteViewModel = {
      id: event.id,
      author,
      createdAt: event.created_at,
      content: this.htmlfier.parse(event.content),
      media: this.htmlfier.extractMedia(event.content),
      reactions,
      zaps,
      reply: this.getReplyContext(event, events),
      repostedBy: this.getRepostedBy(event, events)
    };

    return note;
  }
}
