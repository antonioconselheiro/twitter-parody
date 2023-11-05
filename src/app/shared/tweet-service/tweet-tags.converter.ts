import { Injectable } from '@angular/core';
import { DataLoadType } from '@domain/data-load.type';
import { TEventId } from '@domain/event-id.type';
import { TEventRelationType } from '@domain/event-relation-type.type';
import { NostrEventKind } from '@domain/nostr-event-kind.enum';
import { TNostrPublic } from '@domain/nostr-public.type';
import { ITweet } from '@domain/tweet.interface';
import { ProfileConverter } from '@shared/profile-service/profile.converter';
import Geohash from 'latlon-geohash';
import { Event, nip19 } from 'nostr-tools';
import { TweetTypeGuard } from './tweet.type-guard';

/**
 * NIP12
 * https://github.com/nostr-protocol/nips/blob/master/12.md
 */
@Injectable({
  providedIn: 'root'
})
export class TweetTagsConverter {

  constructor(
    private profilesConverter: ProfileConverter,
    private tweetTypeGuard: TweetTypeGuard
  ) { }

  mergeCoordinatesFromEvent(
    tweet: ITweet<DataLoadType.EAGER_LOADED>,
    event: Event<NostrEventKind>
  ): ITweet<DataLoadType.EAGER_LOADED> {
    const [, geohash] = event.tags.find(tag => tag[0] === 'g') || [];
    if (geohash) {
      tweet.location = Geohash.decode(geohash);
    }

    return tweet;
  }

  getRelatedEvents<T extends NostrEventKind>(event: Event<T>): [
    TEventId, TEventRelationType
  ][] {
    const idIndex = 1;
    const typeIndex = 3;

    return event.tags
      .filter(([type]) => type === 'e')
      .map(event => {
        const idEvent: TEventId = event[idIndex];
        const relationType = (event[typeIndex] || '') as TEventRelationType;

        return [ idEvent, relationType ];
      });
  }

  getFirstRelatedEvent<T extends NostrEventKind>(event: Event<T>): TEventId | null {
    const matriz = this.getRelatedEvents(event);
    return matriz.at(0)?.at(0) || null;
  }

  getMentionedEvent<T extends NostrEventKind>(event: Event<T>): TEventId | null {
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
  
  getNoteMentionedInContent<T extends NostrEventKind>(event: Event<T>): TEventId | null {
    const matches = event.content.match(/nostr:note[\da-z]+/);
    const match = matches && matches[0] || null;
    if (match) {
      console.info('match', match);
      const { data } = nip19.decode(match.replace(/^nostr:/, ''));
      return data ? String(data) : null;
    }

    return null;
  }

  getRepliedEvent<T extends NostrEventKind>(event: Event<T>): {
    replied: TEventId | null,
    root: TEventId | null
  } {
    const replyData: {
      replied: TEventId | null,
      root: TEventId | null
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

  getRelatedProfiles<T extends NostrEventKind>(event: Event<T>): string[] {
    return event.tags
      .filter(([type]) => type === 'p')
      .map(([, pubkey]) => pubkey);
  }

  getFirstRelatedProfile<T extends NostrEventKind>(event: Event<T>): string | null {
    return this.getRelatedProfiles(event).at(0) || null;
  }

  getNostrPublicFromTags(event: Event): TNostrPublic[] {
    return event.tags
      .filter(([type]) => type === 'p')
      .map(([, npub]) => this.profilesConverter.castPubkeyToNostrPublic(npub));
  }

  mergeRetweetingFromEvent(tweet: ITweet, event: Event<NostrEventKind>): void {
    if (this.tweetTypeGuard.isKind(event, NostrEventKind.Repost)) {
      const idEvent = this.getFirstRelatedEvent(event);
      const pubkey = this.getFirstRelatedProfile(event);
      if (idEvent && pubkey) {
        tweet.author = this.profilesConverter.castPubkeyToNostrPublic(pubkey);
        tweet.retweeting = idEvent;
      } else {
        console.warn('[RELAY DATA WARNING] mentioned tweet and/or author not found in retweet', event);
      }
    }
  }
}
