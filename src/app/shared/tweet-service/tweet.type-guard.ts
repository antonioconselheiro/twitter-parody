import { Injectable } from '@angular/core';
import { IProfile } from '@belomonte/nostr-gui-ngx';
import { DataLoadType } from '@domain/data-load.type';
import { IRetweet } from '@domain/retweet.interface';
import { ITweet } from '@domain/tweet.interface';
import { Event, NostrEvent } from 'nostr-tools';
import { TweetCache } from './tweet.cache';

/**
 * Centralize tweet logics with type guard porpouse
 */
@Injectable({
  providedIn: 'root'
})
export class TweetTypeGuard {

  /**
   * @deprecated
   */
  isKind(event: NostrEvent, kind: number): boolean {
    return event.kind === kind;
  }

  isSimpleRetweet(tweet: ITweet): tweet is IRetweet {
    const isRetweet = tweet.retweeting;
    if (isRetweet && tweet.load === DataLoadType.EAGER_LOADED) {
      const nasNoContent = !String(tweet.htmlFullView).trim().length;

      return nasNoContent || false;
    }

    return false;
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

      if (this.isSimpleRetweet(tweet)) {
        return TweetCache.get(tweet.retweeting)
      }
    }

    return tweet;
  }

  isSerializedNostrEvent(serialized: string): boolean {
    try {
      return this.isNostrEvent(JSON.parse(serialized));
    } catch {
      return false;
    }
  }

  /**
   * FIXME: incluir lógica validando assinatura do evento
   */
  isNostrEvent(possiblyNostrEvent: object): possiblyNostrEvent is Event {
    return true;
  }
}
