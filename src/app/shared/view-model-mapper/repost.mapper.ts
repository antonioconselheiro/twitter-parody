import { Inject, Injectable } from '@angular/core';
import { InMemoryNCache, LOCAL_CACHE_TOKEN, NostrEvent, NostrGuard, ProfileService } from '@belomonte/nostr-ngx';
import { HTML_PARSER_TOKEN } from '@shared/htmlfier/html-parser.token';
import { NoteHtmlfier } from '@shared/htmlfier/note-htmlfier.interface';
import { NoteViewModel } from '@view-model/note.view-model';
import { RepostNoteViewModel } from '@view-model/repost-note.view-model';
import { Reaction, Repost, ShortTextNote, Zap } from 'nostr-tools/kinds';
import { AbstractNoteMapper } from './abstract-note.mapper';
import { ReactionMapper } from './reaction.mapper';
import { SimpleTextMapper } from './simple-text.mapper';
import { SingleViewModelMapper } from './single-view-model.mapper';
import { TagHelper } from './tag.helper';
import { ZapMapper } from './zap.mapper';

@Injectable({
  providedIn: 'root'
})
export class RepostMapper extends AbstractNoteMapper implements SingleViewModelMapper<RepostNoteViewModel> {

  constructor(
    protected guard: NostrGuard,
    protected tagHelper: TagHelper,
    private zapMapper: ZapMapper,
    private reactionMapper: ReactionMapper,
    private simpleTextMapper: SimpleTextMapper,
    private profileService: ProfileService,
    @Inject(HTML_PARSER_TOKEN) private htmlfier: NoteHtmlfier,
    @Inject(LOCAL_CACHE_TOKEN) private ncache: InMemoryNCache
  ) {
    super();
  }

  // eslint-disable-next-line complexity
  async toViewModel(event: NostrEvent): Promise<RepostNoteViewModel> {
    const content = event.content || '';
    const contentEvent = this.extractNostrEvent(content);
    const reposting = new Array<NoteViewModel>();

    if (contentEvent) {
      let retweeted: NoteViewModel | null;
      if (this.guard.isKind(contentEvent, ShortTextNote)) {
        retweeted = await this.simpleTextMapper.toViewModel(contentEvent);
        reposting.push(retweeted);
      } else if (this.guard.isKind(contentEvent, Repost)) {
        //  there is no way to get infinity recursively, this was a stringified json
        retweeted = await this.toViewModel(event);
        reposting.push(retweeted);
      }

    } else {
      const mentions = this.tagHelper.getMentionedEvent(event);
      for await (const idEvent of mentions) {
        const retweeted = await this.ncache.get(idEvent);
        if (retweeted) {
          const viewModel = await this.toViewModel(retweeted);
          reposting.push(viewModel);
        }
      }
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
    const isSimpleRepost = this.isSimpleRepost(event);

    const note: RepostNoteViewModel = {
      id: event.id,
      author,
      createdAt: event.created_at,
      content: this.htmlfier.parse(event),
      media: this.htmlfier.extractMedia(event),
      reposting,
      reactions,
      zaps,
      replyContext: this.getReplyContext(event, events),
      repostedBy: this.getRepostedBy(event, events),
      isSimpleRepost
    };

    return note;
  }

  private extractNostrEvent(content: object | string): NostrEvent | false {
    let event: object;
    if (typeof content === 'string') {
      try {
        event = JSON.parse(content);
      } catch {
        return false;
      }
    } else {
      event = content;
    }

    if (this.guard.isNostrEvent(event)) {
      return event;
    }

    return false;
  }

  private isSimpleRepost(event: NostrEvent): boolean {
    const contentWithSimpleRepostMatcher = /^(nostr:event1[a-z0-9]+|#[0])$/;
    if (contentWithSimpleRepostMatcher.test(event.content)) {
      return true;
    }

    return this.guard.isSerializedNostrEvent(event.content);
  }

  patchViewModel(viewModel: NoteViewModel, events: Array<NostrEvent>): Promise<NoteViewModel> {

  }
}
