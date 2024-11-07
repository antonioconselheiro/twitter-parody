import { Inject, Injectable } from '@angular/core';
import { InMemoryNCache, LOCAL_CACHE_TOKEN, NostrEvent, NostrGuard } from '@belomonte/nostr-ngx';
import { RepostNoteViewModel } from '@view-model/repost-note.view-model';
import { SimpleTextNoteViewModel } from '@view-model/simple-text-note.view-model';
import { Repost, ShortTextNote } from 'nostr-tools/kinds';
import { SimpleTextMapper } from './simple-text.mapper';
import { SingleViewModelMapper } from './single-view-model.mapper';
import { TagHelper } from './tag.helper';

@Injectable({
  providedIn: 'root'
})
export class RepostMapper implements SingleViewModelMapper<RepostNoteViewModel> {

  constructor(
    private guard: NostrGuard,
    private tagHelper: TagHelper,
    private simpleTextMapper: SimpleTextMapper,
    @Inject(LOCAL_CACHE_TOKEN) private ncache: InMemoryNCache
  ) { }

  // eslint-disable-next-line complexity
  async toViewModel(event: NostrEvent): Promise<RepostNoteViewModel> {
    const content = event.content || '';
    const contentEvent = this.extractNostrEvent(content);
    let retweeted: SimpleTextNoteViewModel | RepostNoteViewModel;

    if (contentEvent) {
      if (this.guard.isKind(contentEvent, ShortTextNote)) {
        retweeted = await this.simpleTextMapper.toViewModel(contentEvent);
      } else if (this.guard.isKind(contentEvent, Repost)) {
        //  there is no way to get infinity recursively, this was a stringified json
        retweeted = await this.toViewModel(event);
      }
    } else {
      let idEvent = this.tagHelper.getMentionedEvent(event);
      if (!idEvent) {
        idEvent = this.tagHelper.getFirstRelatedEvent(event);
        if (!idEvent) {
          console.warn('[RELAY DATA WARNING] mentioned tweet not found in retweet', event);
        }
      }

      const pubkey = this.tagHelper.getPubkeys(event);
      //  TODO: validate it use pubkey.at(0) here is secure in retweeted events
      if (idEvent) {
        //  TODO: não quero ficar fazendo query pra carregar evento por id
        //  e não achei nada no ncache que me permita acessar eventos por ai
        //  até onde percebi, então vou substituir a interface padrão de cache
        //  para uma nova que ainda definirei
        const event = await this.ncache.get(idEvent)

      }
    }

    //  this is not recommended to use in your events, but must be supported to read:
    //  https://github.com/nostr-protocol/nips/blob/dde8c81a87f01131ed2eec0dd653cd5b79900b82/08.md
    //  FIXME: pode conter diversas referências para notes neste formato, preciso de uma transformação melhor do que essa
    const retweetIdentifier = /(#\[0\])|(nostr:note[\da-z]+)/;
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

  private extractNostrEvent(content: object | string): Event | false {
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
