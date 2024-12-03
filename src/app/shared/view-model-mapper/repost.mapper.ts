import { Inject, Injectable } from '@angular/core';
import { InMemoryNCache, LOCAL_CACHE_TOKEN, NostrEvent, NostrGuard } from '@belomonte/nostr-ngx';
import { HTML_PARSER_TOKEN } from '@shared/htmlfier/html-parser.token';
import { NoteHtmlfier } from '@shared/htmlfier/note-htmlfier.interface';
import { RepostNoteViewModel } from '@view-model/repost-note.view-model';
import { SimpleTextNoteViewModel } from '@view-model/simple-text-note.view-model';
import { Repost, ShortTextNote } from 'nostr-tools/kinds';
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
    @Inject(HTML_PARSER_TOKEN) private htmlfier: NoteHtmlfier,
    @Inject(LOCAL_CACHE_TOKEN) private ncache: InMemoryNCache
  ) {
    super();
  }

  // eslint-disable-next-line complexity
  async toViewModel(event: NostrEvent): Promise<RepostNoteViewModel> {
    const content = event.content || '';
    const contentEvent = this.extractNostrEvent(content);
    let retweeted: SimpleTextNoteViewModel | RepostNoteViewModel | NostrEvent | null;

    if (contentEvent) {
      if (this.guard.isKind(contentEvent, ShortTextNote)) {
        retweeted = await this.simpleTextMapper.toViewModel(contentEvent);
      } else if (this.guard.isKind(contentEvent, Repost)) {
        //  there is no way to get infinity recursively, this was a stringified json
        retweeted = await this.toViewModel(event);
      }
    } else {
      let [idEvent = null] = this.tagHelper.getMentionedEvent(event);
      if (!idEvent) {
        idEvent = this.tagHelper.getFirstRelatedEvent(event);
      }

      if (idEvent) {
        retweeted = await this.ncache.get(idEvent);
      } else {
        console.warn('[RELAY DATA WARNING] mentioned tweet not found in retweet', event);
      }

      //  TODO: validate it use pubkey.at(0) here is secure in retweeted events
      if (idEvent) {
        const respoted = await this.ncache.get(idEvent);
        if (respoted) {
          const viewModel = await this.toViewModel(respoted);

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

    const note: RepostNoteViewModel = {
      id: event.id,
      author: event.pubkey,
      createdAt: event.created_at,
      content: this.htmlfier.parse(event),
      media: this.htmlfier.extractMedia(event),
      reactions,
      zaps,
      replyContext: this.getReplyContext(event, events),
      repostedBy: this.getRepostedBy(event, events)
    };

    //  this is not recommended to use in your events, but must be supported to read:
    //  https://github.com/nostr-protocol/nips/blob/dde8c81a87f01131ed2eec0dd653cd5b79900b82/08.md
    //  FIXME: pode conter diversas referências para notes neste formato, preciso de uma transformação melhor do que essa
    const retweetIdentifier = /(#\[\d+\])|(nostr:note[\da-z]+)/;
    content = content.replace(retweetIdentifier, '').trim();
    if (this.guard.isSerializedNostrEvent(content)) {
      content = '';
    }

    const retweetAsTweet: NostrEvent = { ...event, content, kind: ShortTextNote };
    const { tweet: retweet, npubs: npubs2 } = this.castEventToTweet(retweetAsTweet, retweeted.id);
    npubs = npubs.concat(npubs2);
    if (retweeted.author) {
      npubs.push(retweeted.author);
    }

    retweeted.retweetedBy = {
      [event.id]: author
    };

    return {
      retweet, retweeted, npubs
    };
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
