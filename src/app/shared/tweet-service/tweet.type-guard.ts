import { Injectable } from '@angular/core';
import { Retweet } from 'src/app/deprecated-domain/retweet.interface';
import { Tweet } from 'src/app/deprecated-domain/tweet.interface';
import { verifyEvent } from 'nostr-tools';
import { NostrMetadata } from '@nostrify/nostrify';

/**
 * Centralize tweet logics with type guard porpouse
 */
@Injectable({
  providedIn: 'root'
})
export class TweetTypeGuard {

  isSimpleRetweet(tweet: Tweet): tweet is Retweet {
    if (tweet.retweeting) {
      const nasNoContent = !String(tweet.htmlFullView).trim().length;

      return nasNoContent || false;
    }

    return false;
  }

  isRetweetedByProfile(tweet: Tweet | Retweet, pubkey: string | null): tweet is Retweet {
    if (!pubkey) {
      return false;
    }

    tweet = this.getShowingTweet(tweet);
    if (!tweet.retweetedBy) {
      return false;
    }

    return Object.values(tweet.retweetedBy).includes(pubkey);
  }

  isLikedByProfile(tweet: Tweet | Retweet, profile: NostrMetadata | null): boolean {
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
  getShowingTweet(tweet: Tweet | Retweet): Tweet;
  getShowingTweet(tweet: Tweet | Retweet | null): Tweet | null;
  getShowingTweet(tweet: Tweet | Retweet | null): Tweet | null {
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
