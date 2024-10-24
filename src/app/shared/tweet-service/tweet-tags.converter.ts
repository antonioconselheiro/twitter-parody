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

  getRelatedEvents(event: NostrEvent): [
    string, EventRelationType
  ][] {
    const idIndex = 1;
    const typeIndex = 3;

    return event.tags
      .filter(([type]) => type === 'e')
      .map(event => {
        const idEvent = event[idIndex];
        const relationType = (event[typeIndex] || '') as EventRelationType;

        return [ idEvent, relationType ];
      });
  }

  getFirstRelatedEvent(event: NostrEvent): string | null {
    const matriz = this.getRelatedEvents(event);
    return matriz.at(0)?.at(0) || null;
  }

  getMentionedEvent(event: NostrEvent): string | null {
    const mentionedFound = this
      .getRelatedEvents(event)
      .filter(([,type]) => type === 'mention')
      .map(([idEvent]) => idEvent)
      .at(0) || null;

    if (!mentionedFound) {
      return this.getNoteMentionedInContent(event);
    }
    
    return mentionedFound;
  }
  
  getNoteMentionedInContent(event: NostrEvent): string | null {
    const matches = event.content.match(/nostr:note[\da-z]+/);
    const match = matches && matches[0] || null;
    if (match) {
      const { data } = nip19.decode(match.replace(/^nostr:/, ''));
      return data ? String(data) : null;
    }

    return null;
  }

  getRepliedEvent(event: NostrEvent): {
    replied: string | null,
    root: string | null
  } {
    const replyData: {
      replied: string | null,
      root: string | null
    } = {
      replied: null,
      root: null
    };

    this
      .getRelatedEvents(event)
      .forEach(([idEvent, relation]) => {
        if (relation === 'reply') {
          replyData.replied = idEvent;
        } else if (relation === 'root') {
          replyData.root = idEvent;
        }
      });

    return replyData;
  }

  getRelatedProfiles(event: NostrEvent): string[] {
    return event.tags
      .filter(([type]) => type === 'p')
      .map(([, pubkey]) => pubkey);
  }

  getFirstRelatedProfile(event: NostrEvent): string | null {
    return this.getRelatedProfiles(event).at(0) || null;
  }

  getNostrPublicFromTags(event: Event): NPub[] {
    return event.tags
      .filter(([type]) => type === 'p')
      .map(([, npub]) => this.nostrConverter.convertPubkeyToPublicKeys(npub).npub);
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
