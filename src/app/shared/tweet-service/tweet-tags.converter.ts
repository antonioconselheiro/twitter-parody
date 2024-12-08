import { Injectable } from '@angular/core';
import { NostrConverter, NostrEvent, NostrGuard } from '@belomonte/nostr-ngx';
import Geohash from 'latlon-geohash';
import { Repost } from 'nostr-tools/kinds';
import { Tweet } from '../../deprecated-domain/tweet.interface';

/**
 * NIP12
 * https://github.com/nostr-protocol/nips/blob/master/12.md
 */
@Injectable({
  providedIn: 'root'
})
export class TweetTagsConverter {

  constructor(
    private guard: NostrGuard,
    private nostrConverter: NostrConverter
  ) { }

  mergeCoordinatesFromEvent(
    tweet: Tweet,
    event: NostrEvent
  ): Tweet {
    const [, geohash] = event.tags.find(tag => tag[0] === 'g') || [];
    if (geohash) {
      tweet.location = Geohash.decode(geohash);
    }

    return tweet;
  }



  mergeRetweetingFromEvent(tweet: Tweet, event: NostrEvent): void {
    if (this.guard.isKind(event, Repost)) {
      const idEvent = this.getFirstRelatedEvent(event);
      const pubkey = this.getFirstRelatedProfile(event);
      if (idEvent && pubkey) {
        tweet.author = this.nostrConverter.convertPubkeyToPublicKeys(pubkey);
        tweet.retweeting = idEvent;
      } else {
        console.warn('[RELAY DATA WARNING] mentioned tweet and/or author not found in retweet', event);
      }
    }
  }
}
