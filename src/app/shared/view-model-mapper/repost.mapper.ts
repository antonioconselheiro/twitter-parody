import { Inject, Injectable } from '@angular/core';
import { Account, InMemoryEventCache, NOSTR_CACHE_TOKEN, NostrEvent, NostrGuard, ProfileProxy } from '@belomonte/nostr-ngx';
import { HTML_PARSER_TOKEN } from '@shared/htmlfier/html-parser.token';
import { NoteHtmlfier } from '@shared/htmlfier/note-htmlfier.interface';
import { NoteReplyContext } from '@view-model/context/note-reply-context.interface';
import { NostrViewModelSet } from '@view-model/nostr-view-model.set';
import { NoteViewModel } from '@view-model/note.view-model';
import { RepostNoteViewModel } from '@view-model/repost-note.view-model';
import { Reaction, Repost, ShortTextNote, Zap } from 'nostr-tools/kinds';
import { ReactionMapper } from './reaction.mapper';
import { SimpleTextMapper } from './simple-text.mapper';
import { SingleViewModelMapper } from './single-view-model.mapper';
import { TagHelper } from './tag.helper';
import { ZapMapper } from './zap.mapper';

@Injectable({
  providedIn: 'root'
})
export class RepostMapper implements SingleViewModelMapper<RepostNoteViewModel> {

  constructor(
    private guard: NostrGuard,
    private tagHelper: TagHelper,
    private zapMapper: ZapMapper,
    private profileProxy: ProfileProxy,
    private reactionMapper: ReactionMapper,
    private simpleTextMapper: SimpleTextMapper,
    @Inject(HTML_PARSER_TOKEN) private htmlfier: NoteHtmlfier,
    @Inject(NOSTR_CACHE_TOKEN) private ncache: InMemoryEventCache
  ) { }

  //  FIXME: refactor this into minor methods
  // eslint-disable-next-line complexity
  toViewModel(event: NostrEvent): RepostNoteViewModel {
    const content = event.content || '';
    const contentEvent = this.extractNostrEvent(content);
    const reposting = new NostrViewModelSet<NoteViewModel>();

    if (contentEvent) {
      let retweeted: NoteViewModel<Account> | null;
      if (this.guard.isKind(contentEvent, Repost)) {
        //  there is no way to get infinity recursively, this was a stringified json
        retweeted = this.toViewModel(contentEvent);
        reposting.add(retweeted);
      } else if (this.guard.isKind(contentEvent, ShortTextNote)) {
        retweeted = this.simpleTextMapper.toViewModel(contentEvent);
        reposting.add(retweeted);
      }

    } else {
      const mentions = this.tagHelper.getMentionedEvent(event);
      for (const idEvent of mentions) {
        const retweeted = this.ncache.get(idEvent);
        if (retweeted) {
          const viewModel = this.toViewModel(retweeted);
          reposting.add(viewModel);
        }
      }
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
    const author = this.profileProxy.getAccount(event.pubkey);
    const reply: NoteReplyContext = { replies: new NostrViewModelSet<NoteViewModel>() };

    const note: RepostNoteViewModel = {
      id: event.id,
      author,
      createdAt: event.created_at,
      content: this.htmlfier.parse(event.content),
      media: this.htmlfier.extractMedia(event.content),
      reposting,
      reactions,
      zaps,
      reply,
      //  TODO: ideally I should pass relay address from where this event come
      origin: [],
      reposted: new NostrViewModelSet<NoteViewModel>(),
      mentioned: new NostrViewModelSet<NoteViewModel>(),
      event
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
}
