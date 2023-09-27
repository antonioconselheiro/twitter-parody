import { Injectable } from "@angular/core";
import { DataLoadType } from "@domain/data-load.type";
import { TEventId } from "@domain/event-id.type";
import { NostrEventKind } from "@domain/nostr-event-kind";
import { TNostrPublic } from "@domain/nostr-public.type";
import { IRetweet } from "@domain/retweet.interface";
import { ITweet } from "@domain/tweet.interface";
import { Event } from 'nostr-tools';
import { TweetApi } from "./tweet.api";
import { TweetConverter } from "./tweet.converter";
import { TweetMerge } from "./tweet.merge";

/**
 * This class responsible for caching event information
 * involving tweets, including events: Text (1), Deleted (5),
 * Reaction (6), Repost (7) and Zapped (9735).
 * 
 * the events will be processed and stored in the format of
 * tweet interfaces, and will also be associated in their
 * appropriate relationships (who retweeted who? threaded
 * responses and threaded threads), through a property or
 * list containing the ids of the events that are related,
 * to avoid relationships circulate between the structure
 * preventing it from being serialized and cached
 */
@Injectable()
export class TweetCache {

  static instance: TweetCache | null = null;

  static lazyTweets: {
    [idEvent: TEventId]: ITweet<DataLoadType.LAZY_LOADED>
  } = { };

  static eagerTweets: {
    [idEvent: TEventId]: ITweet<DataLoadType.EAGER_LOADED>
  } = { };

  static get(idEvent: TEventId): ITweet<DataLoadType.EAGER_LOADED> | IRetweet {
    return TweetCache.eagerTweets[idEvent];
  }

  constructor(
    private tweetApi: TweetApi,
    private tweetMerge: TweetMerge,
    private tweetConverter: TweetConverter
  ) {
    if (!TweetCache.instance) {
      TweetCache.instance = this;
    }

    return TweetCache.instance;
  }

  async load(idEvent: TEventId): Promise<ITweet>;
  async load(idEvent: TEventId[]): Promise<ITweet[]>;
  async load(idEvent: TEventId[] | TEventId): Promise<ITweet | ITweet[]> {
    if (typeof idEvent === 'string') {
      return TweetCache.eagerTweets[idEvent] && Promise.resolve(TweetCache.eagerTweets[idEvent]) || this.loadTweet(idEvent);
    } else {
      return this.loadTweetsFromIdEvents(idEvent);
    }
  }

  get(idEvent: TEventId): ITweet<DataLoadType.EAGER_LOADED> | IRetweet {
    return TweetCache.get(idEvent);
  }

  async loadTweet(events: TEventId): Promise<ITweet> {
    return this.loadTweetsFromIdEvents([events]).then(tweets => Promise.resolve(tweets[0]))
  }
  
  async loadTweetsFromIdEvents(idEvents: TEventId[]): Promise<ITweet[]> {
    const notLoadedList = idEvents.filter(id => {
      if (TweetCache.eagerTweets[id]) {
        return false;
      }

      return true;
    });

    const events = await this.tweetApi.loadEvents(notLoadedList);
    
    this.cache(events);
    return Promise.resolve(idEvents.map(id => this.get(id)));
  }
  
  cache(events: Event<NostrEventKind>[]): Array<TNostrPublic> {
    const wrapper = this.tweetConverter
    .castResultsetToTweets(events);

    wrapper.eager.forEach(tweet => this.cacheTweet(tweet));
    wrapper.lazy.forEach(tweet => this.cacheTweet(tweet));

    return wrapper.npubs;
  }

  /**
   * Cache the eager loaded data, merge lazy loaded data with
   * the cached lazy loaded data, merge lazy loaded cached data
   * with eager loaded cached data and remove
   */
  private cacheTweet<T>(tweet: ITweet<T>): void {
    if (tweet.load === DataLoadType.EAGER_LOADED) {
      TweetCache.eagerTweets[tweet.id] = tweet as ITweet<DataLoadType.EAGER_LOADED>;

      if (TweetCache.lazyTweets[tweet.id]) {
        this.cacheTweet(TweetCache.lazyTweets[tweet.id]);
      }
    } else if (tweet.load === DataLoadType.LAZY_LOADED) {
      const lazyLoaded = TweetCache.lazyTweets[tweet.id] = this.tweetMerge.mergeLazyLoadedTweets(
        TweetCache.lazyTweets[tweet.id], tweet as ITweet<DataLoadType.LAZY_LOADED>
      );

      const eagerLoaded = TweetCache.eagerTweets[tweet.id];
      if (eagerLoaded) {
        TweetCache.eagerTweets[tweet.id] = this.tweetMerge.mergeLazyLoadedTweets(
          eagerLoaded, lazyLoaded
        )
      }
    }
  }

  async eagerLoadRelatedEvents(tweets: ITweet<DataLoadType.EAGER_LOADED>[]): Promise<void> {
    const idEvents = this.tweetConverter.extractEventsAndNPubsFromTweets(tweets);
    const events = await this.tweetApi.loadRelatedEvents(idEvents);
    this.cache(events);

    return Promise.resolve();
  }
}