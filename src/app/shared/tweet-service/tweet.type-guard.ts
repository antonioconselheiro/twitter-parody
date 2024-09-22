import { Injectable } from '@angular/core';
import { IRetweet } from '@domain/retweet.interface';
import { ITweet } from '@domain/tweet.interface';
import { verifyEvent } from 'nostr-tools';
import { NostrMetadata } from '@nostrify/nostrify';

/**
 * Centralize tweet logics with type guard porpouse
 */
@Injectable({
  providedIn: 'root'
})
export class TweetTypeGuard {

  isSimpleRetweet(tweet: ITweet): tweet is IRetweet {
    if (tweet.retweeting) {
      const nasNoContent = !String(tweet.htmlFullView).trim().length;

      return nasNoContent || false;
    }

    return false;
  }

  isRetweetedByProfile(tweet: ITweet | IRetweet, pubkey: string | null): tweet is IRetweet {
    if (!pubkey) {
      return false;
    }

    tweet = this.getShowingTweet(tweet);
    if (!tweet.retweetedBy) {
      return false;
    }

    return Object.values(tweet.retweetedBy).includes(pubkey);
  }

  isLikedByProfile(tweet: ITweet | IRetweet, profile: NostrMetadata | null): boolean {
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
      return verifyEvent(JSON.parse(serialized));
    } catch {
      return false;
    }
  }
}
