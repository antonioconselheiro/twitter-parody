import { Injectable } from "@angular/core";
import { DataLoadType } from "@domain/data-load.type";
import { EventId } from "@domain/event-id.type";
import { IReaction } from "@domain/reaction.interface";
import { IRetweet } from "@domain/retweet.interface";
import { ITweet } from "@domain/tweet.interface";
import { ProfilesObservable } from "@shared/profile-service/profiles.observable";
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
export class TweetStatefull {

  static instance: TweetStatefull | null = null;

  lazyTweets: {
    [idEvent: EventId]: ITweet<DataLoadType.LAZY_LOADED>
  } = { };

  eagerTweets: {
    [idEvent: EventId]: ITweet<DataLoadType.EAGER_LOADED>
  } = { };

  constructor(
    private tweetApi: TweetApi,
    private profile$: ProfilesObservable,
    private tweetConverter: TweetConverter
  ) {
    if (!TweetStatefull.instance) {
      TweetStatefull.instance = this;
    }

    return TweetStatefull.instance;
  }

  async load(idEvent: EventId): Promise<ITweet>;
  async load(idEvent: EventId[]): Promise<ITweet[]>;
  async load(idEvent: EventId[] | EventId): Promise<ITweet | ITweet[]> {
    if (typeof idEvent === 'string') {
      return this.eagerTweets[idEvent] && Promise.resolve(this.eagerTweets[idEvent]) || this.loadTweet(idEvent);
    } else {
      return this.loadTweets(idEvent);
    }
  }

  get(idEvent: EventId): ITweet<DataLoadType.EAGER_LOADED> | IRetweet {
    return this.eagerTweets[idEvent];
  }

  async loadTweet(events: EventId): Promise<ITweet> {
    return this.loadTweets([events]).then(tweets => Promise.resolve(tweets[0]))
  }
  
  async loadTweets(idEvents: EventId[]): Promise<ITweet[]> {
    const notLoadedList = idEvents.filter(id => {
      if (this.eagerTweets[id]) {
        return false;
      }

      return true;
    });

    const events = await this.tweetApi.loadEvents(notLoadedList);

    this.tweetConverter
      .castResultsetToTweets(events)
      .forEach(tweet => this.eagerTweets[tweet.id] = tweet);

    return Promise.resolve(idEvents.map(id => this.get(id)));
  }

  private extractEventsAndNPubsFromTweets(tweets: ITweet[]): EventId[] {
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