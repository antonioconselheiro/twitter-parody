import { Inject, Injectable } from '@angular/core';
import { MAIN_NCACHE_TOKEN, NostrEvent, NostrGuard } from '@belomonte/nostr-ngx';
import { NCache } from '@nostrify/nostrify';
import { HTML_PARSER_TOKEN } from '@shared/htmlfier/html-parser.token';
import { NoteHtmlfier } from '@shared/htmlfier/note-htmlfier.interface';
import { NoteReplyContext } from '@view-model/context/note-reply-context.interface';
import { RepostNoteViewModel } from '@view-model/repost-note.view-model';
import { SimpleTextNoteViewModel } from '@view-model/simple-text-note.view-model';
import { ReactionMapper } from './reaction.mapper';
import { SingleViewModelMapper } from './single-view-model.mapper';
import { ZapMapper } from './zap.mapper';
import { kinds } from 'nostr-tools';
import { Reaction, ShortTextNote, Zap } from 'nostr-tools/kinds';

@Injectable({
  providedIn: 'root'
})
export class SimpleTextMapper implements SingleViewModelMapper<SimpleTextNoteViewModel | RepostNoteViewModel> {

  constructor(
    @Inject(HTML_PARSER_TOKEN) private htmlfier: NoteHtmlfier,
    @Inject(MAIN_NCACHE_TOKEN) private ncache: NCache,
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

    const note: SimpleTextNoteViewModel = {
      id: event.id,
      author: event.pubkey,
      createdAt: event.created_at,
      content: this.htmlfier.parse(event),
      media: this.htmlfier.extractMedia(event),
      reactions: await this.reactionMapper.toViewModel(events),
      zaps: await this.zapMapper.toViewModel(events),
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
