import { Inject, Injectable } from '@angular/core';
import { MAIN_NCACHE_TOKEN } from '@belomonte/nostr-ngx';
import { NCache, NostrEvent } from '@nostrify/nostrify';
import { kinds } from 'nostr-tools';
import { HTML_PARSER_TOKEN } from '@shared/htmlfier/html-parser.token';
import { NoteHtmlfier } from '@shared/htmlfier/note-htmlfier.interface';
import { NoteReplyContext } from '@view-model/context/note-reply-context.interface';
import { RepostNoteViewModel } from '@view-model/repost-note.view-model';
import { SimpleTextNoteViewModel } from '@view-model/simple-text-note.view-model';
import { SortedNostrViewModelSet } from '@view-model/sorted-nostr-view-model.set';
import { ZapViewModel } from '@view-model/zap.view-model';
import { ReactionMapper } from './reaction.mapper';
import { ZapMapper } from './zap.mapper';

@Injectable({
  providedIn: 'root'
})
export class SimpleTextMapper {

  constructor(
    @Inject(HTML_PARSER_TOKEN) private htmlfier: NoteHtmlfier,
    @Inject(MAIN_NCACHE_TOKEN) private ncache: NCache,
    private reactionMapper: ReactionMapper,
    private zapMapper: ZapMapper
  ) { }

  async toViewModel(event: NostrEvent): Promise<SimpleTextNoteViewModel | RepostNoteViewModel> {

    await this.ncache.query([
      {
        kinds: [
          kinds.Reaction,
          kinds.Zap
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
      reactions: {},
      zaps: new SortedNostrViewModelSet<ZapViewModel>(),
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
