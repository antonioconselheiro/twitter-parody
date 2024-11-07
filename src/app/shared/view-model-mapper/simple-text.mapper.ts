import { Inject, Injectable } from '@angular/core';
import { InMemoryNCache, LOCAL_CACHE_TOKEN, NostrEvent, NostrGuard } from '@belomonte/nostr-ngx';
import { HTML_PARSER_TOKEN } from '@shared/htmlfier/html-parser.token';
import { NoteHtmlfier } from '@shared/htmlfier/note-htmlfier.interface';
import { NoteReplyContext } from '@view-model/context/note-reply-context.interface';
import { RepostNoteViewModel } from '@view-model/repost-note.view-model';
import { SimpleTextNoteViewModel } from '@view-model/simple-text-note.view-model';
import { Reaction, ShortTextNote, Zap } from 'nostr-tools/kinds';
import { ReactionMapper } from './reaction.mapper';
import { SingleViewModelMapper } from './single-view-model.mapper';
import { ZapMapper } from './zap.mapper';

@Injectable({
  providedIn: 'root'
})
export class SimpleTextMapper implements SingleViewModelMapper<SimpleTextNoteViewModel | RepostNoteViewModel> {

  constructor(
    @Inject(HTML_PARSER_TOKEN) private htmlfier: NoteHtmlfier,
    @Inject(LOCAL_CACHE_TOKEN) private ncache: InMemoryNCache,
    private reactionMapper: ReactionMapper,
    private zapMapper: ZapMapper,
    private guard: NostrGuard
  ) { }

  async toViewModel(event: NostrEvent<ShortTextNote>): Promise<SimpleTextNoteViewModel | RepostNoteViewModel>;
  async toViewModel(event: NostrEvent): Promise<SimpleTextNoteViewModel | RepostNoteViewModel | null>;
  async toViewModel(event: NostrEvent): Promise<SimpleTextNoteViewModel | RepostNoteViewModel | null> {
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

    const note: SimpleTextNoteViewModel = {
      id: event.id,
      author: event.pubkey,
      createdAt: event.created_at,
      content: this.htmlfier.parse(event),
      media: this.htmlfier.extractMedia(event),
      reactions,
      zaps,
      replyContext: this.getReplyContext(event),
      repostedBy: this.getRepostedBy(event)
    };

    return note;
  }

  private getReplyContext(event: NostrEvent): NoteReplyContext {

  }

  private getRepostedBy(event: NostrEvent): Array<string> {

  }
}
