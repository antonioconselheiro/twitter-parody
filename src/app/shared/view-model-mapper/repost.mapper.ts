import { Inject, Injectable } from '@angular/core';
import { MAIN_NCACHE_TOKEN, NostrEvent, NostrGuard } from '@belomonte/nostr-ngx';
import { NCache } from '@nostrify/nostrify';
import { RepostNoteViewModel } from '@view-model/repost-note.view-model';
import { SingleViewModelMapper } from './single-view-model.mapper';

@Injectable({
  providedIn: 'root'
})
export class RepostMapper implements SingleViewModelMapper<RepostNoteViewModel> {
  constructor(
    private guard: NostrGuard,
    @Inject(MAIN_NCACHE_TOKEN) private ncache: NCache
  ) { }

  toViewModel(event: NostrEvent): Promise<RepostNoteViewModel> {
    let content = this.getTweetContent(event);
    const author = this.getAuthorNostrPublicFromEvent(event);
    let npubs: NPub[] = [author];
    let retweeted: Tweet;

    const contentEvent = this.extractNostrEvent(content);

    if (contentEvent) {
      const retweetedEvent: NostrEvent = contentEvent;
      const { tweet, npubs: npubs2 } = this.castEventToTweet(retweetedEvent);
      retweeted = tweet;
      npubs = npubs.concat(npubs2);
    } else {
      let idEvent = this.tweetTagsConverter.getMentionedEvent(event);
      if (!idEvent) {
        idEvent = this.tweetTagsConverter.getFirstRelatedEvent(event);
        if (!idEvent) {
          console.warn('[RELAY DATA WARNING] mentioned tweet not found in retweet', event);
        }
      }

      const pubkey = this.tweetTagsConverter.getRelatedProfiles(event);
      //  TODO: validate it use pubkey.at(0) here is secure in retweeted events
      retweeted = this.createLazyLoadableTweetFromEventId(idEvent || '', pubkey.at(0));
    }

    const retweetIdentifier = /(#\[0\])|(nostr:note[\da-z]+)/;
    content = content.replace(retweetIdentifier, '').trim();
    if (this.tweetTypeGuard.isSerializedNostrEvent(content)) {
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
}
