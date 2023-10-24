import { Injectable } from '@angular/core';
import { DataLoadType } from '@domain/data-load.type';
import { NostrEventKind } from '@domain/nostr-event-kind.enum';
import { IProfile } from '@domain/profile.interface';
import { IRetweet } from '@domain/retweet.interface';
import { ITweet } from '@domain/tweet.interface';
import { Event } from 'nostr-tools';
import { TweetCache } from './tweet.cache';

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

  isRetweetedByProfile(tweet: ITweet | IRetweet, profile: IProfile | null): tweet is IRetweet {
    if (!profile) {
      return false;
    }

    tweet = this.getShowingTweet(tweet);
    if (!tweet.retweetedBy) {
      return false;
    }

    return Object.values(tweet.retweetedBy).includes(profile.npub);
  }

  isLikedByProfile(tweet: ITweet | IRetweet, profile: IProfile | null): boolean {
    tweet = this.getShowingTweet(tweet);
    const reactions = Object.values(tweet.reactions);
    if (!profile || !reactions.length) {
      return false;
    }

    return !!reactions.find(reaction => reaction.author === profile.npub)
  }

  /**
   * Show note if is a simple text, but if it's a retweet
   * it shows the retweeted note
   */
  getShowingTweet(tweet: ITweet | IRetweet): ITweet;
  getShowingTweet(tweet: ITweet | IRetweet | null): ITweet | null;
  getShowingTweet(tweet: ITweet | IRetweet | null): ITweet | null {
    if (!tweet) {
      return null;
    } else if (tweet.retweeting) {
      const retweeting = TweetCache.get(tweet.retweeting);
      if (!retweeting) {
        console.error(`Event ${tweet.retweeting} not found in cache, please load the event and the relationed data before try to access it`);
      }

      return TweetCache.get(tweet.retweeting);
    } else {
      return tweet;
    }
  }
}
