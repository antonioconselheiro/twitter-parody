import { Injectable } from '@angular/core';
import { NostrConverter, NostrEvent, NostrGuard } from '@belomonte/nostr-ngx';
import { EventRelationType } from '@view-model/event-relation.type';
import { Tweet } from '../../deprecated-domain/tweet.interface';
import Geohash from 'latlon-geohash';
import { Event, kinds, nip19 } from 'nostr-tools';
import { NPub } from 'nostr-tools/nip19';
import { Repost } from 'nostr-tools/kinds';

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
