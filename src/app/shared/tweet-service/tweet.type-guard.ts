import { Event } from 'nostr-tools';
import { Injectable } from '@angular/core';
import { NostrEventKind } from '@domain/nostr-event-kind';
import { DataLoadType } from '@domain/data-load.type';
import { ITweet } from '@domain/tweet.interface';
import { IRetweet } from '@domain/retweet.interface';

/**
 * Centralize tweet logics with type guard porpouse
 */
@Injectable({
  providedIn: 'root'
})
export class TweetTypeGuard {

  isKind<T extends NostrEventKind>(event: Event<NostrEventKind>, kind: T): event is Event<T> {
    return event.kind === kind;
  }

  isSimpleRetweet(tweet: ITweet): tweet is IRetweet {
    return tweet.retweeting
      && tweet.load === DataLoadType.EAGER_LOADED
      && !String(tweet.htmlFullView).trim().length
      || false;
  }
}
