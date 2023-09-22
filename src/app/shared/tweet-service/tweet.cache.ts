import { Injectable } from "@angular/core";
import { DataLoadType } from "@domain/data-load.type";
import { TEventId } from "@domain/event-id.type";
import { IRetweet } from "@domain/retweet.interface";
import { ITweet } from "@domain/tweet.interface";
import { AuthProfileObservable } from "@shared/profile-service/profiles.observable";
import { TweetApi } from "./tweet.api";
import { TweetConverter } from "./tweet.converter";

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

  constructor(
    private tweetApi: TweetApi,
    private profile$: AuthProfileObservable,
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
      return this.loadTweets(idEvent);
    }
  }

  get(idEvent: TEventId): ITweet<DataLoadType.EAGER_LOADED> | IRetweet {
    return TweetCache.eagerTweets[idEvent];
  }

  async loadTweet(events: TEventId): Promise<ITweet> {
    return this.loadTweets([events]).then(tweets => Promise.resolve(tweets[0]))
  }
  
  async loadTweets(idEvents: TEventId[]): Promise<ITweet[]> {
    const notLoadedList = idEvents.filter(id => {
      if (TweetCache.eagerTweets[id]) {
        return false;
      }

      return true;
    });

    const events = await this.tweetApi.loadEvents(notLoadedList);

    this.tweetConverter
      .castResultsetToTweets(events)
      .forEach(tweet => TweetCache.eagerTweets[tweet.id] = tweet);

    return Promise.resolve(idEvents.map(id => this.get(id)));
  }

  private extractEventsAndNPubsFromTweets(tweets: ITweet[]): TEventId[] {
    return tweets.map(tweet => {
      const replies = tweet.replies || [];
      const repling = tweet.repling ? [tweet.repling] : [];
      const retweetedBy = tweet.retweetedBy || [];
      const retweeting = tweet.retweeting ? [tweet.retweeting] : [];
      
      return [ ...replies, ...repling, ...retweetedBy, ...retweeting ];
    }).flat(1);
  }

  async eagerLoadRelatedEvents(tweets: ITweet<DataLoadType.EAGER_LOADED>[]): Promise<ITweet<DataLoadType.EAGER_LOADED>[]> {
    const idEvents = this.extractEventsAndNPubsFromTweets(tweets);
    const events = await this.tweetApi.loadRelatedEvents(idEvents);

    tweets = this.tweetConverter.castResultsetToTweets(events);
    return Promise.resolve(tweets);
  }

  async listTweetsFrom(npub: string): Promise<ITweet<DataLoadType.EAGER_LOADED>[]> {
    const events = await this.tweetApi.listTweetsFrom(npub);
    this.profile$.cache(events);

    const tweets = this.tweetConverter.castResultsetToTweets(events);
    return Promise.resolve(tweets);
  }

  async listReactionsFrom(npub: string): Promise<ITweet[]> {
    const events = await this.tweetApi.listReactionsFrom(npub);
    this.profile$.cache(events);

    const tweets = this.tweetConverter.castResultsetToTweets(events);
    return Promise.resolve(tweets);
  }
}