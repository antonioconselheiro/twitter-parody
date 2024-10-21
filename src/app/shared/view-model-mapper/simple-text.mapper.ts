import { Inject, Injectable } from '@angular/core';
import { MAIN_NCACHE_TOKEN } from '@belomonte/nostr-ngx';
import { NCache, NostrEvent } from '@nostrify/nostrify';
import { HTML_PARSER_TOKEN } from '@shared/htmlfy/html-parser.token';
import { NoteHtmlfier } from '@shared/htmlfy/note-htmlfier.interface';
import { NoteReplyContext } from '@view-model/context/note-reply-context.interface';
import { RepostNoteViewModel } from '@view-model/repost-note.view-model';
import { SimpleTextNoteViewModel } from '@view-model/simple-text-note.view-model';
import { SortedNostrViewModelSet } from '@view-model/sorted-nostr-view-model.set';
import { ZapViewModel } from '@view-model/zap.view-model';

@Injectable({
  providedIn: 'root'
})
export class SimpleTextMapper {

  constructor(
    @Inject(HTML_PARSER_TOKEN) private htmlfy: NoteHtmlfier,
    @Inject(MAIN_NCACHE_TOKEN) private ncache: NCache
  ) { }

  toViewModel(event: NostrEvent): SimpleTextNoteViewModel | RepostNoteViewModel {
    const note: SimpleTextNoteViewModel = {
      id: event.id,
      author: event.pubkey,
      createdAt: event.created_at,
      content: this.htmlfy.parse(event),
      media: this.htmlfy.extractMedia(event),
      reactions: {},
      zaps: new SortedNostrViewModelSet<ZapViewModel>(),
      replyContext: this.getReplyContext(event),
      repostedBy: this.getRepostedBy(event)
    };
  }

  private getReplyContext(event: NostrEvent): NoteReplyContext {
    
  }

  private getRepostedBy(event: NostrEvent): Array<string> {
    
  }
}
