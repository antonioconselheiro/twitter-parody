import { Injectable } from "@angular/core";
import { DataLoadType } from "@domain/data-load.type";
import { EventId } from "@domain/event-id.type";
import { NostrEventKind } from "@domain/nostr-event-kind";
import { IReaction } from "@domain/reaction.interface";
import { ITweet } from "@domain/tweet.interface";
import { ApiService } from "@shared/api-service/api.service";
import { ProfilesObservable } from "@shared/profile-service/profiles.observable";
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

  reactions: {
    [idEvent: EventId]: IReaction
  } = { };

  lazyTweets: {
    [idEvent: EventId]: ITweet<DataLoadType.LAZY_LOADED>
  } = { };

  eagerTweets: {
    [idEvent: EventId]: ITweet<DataLoadType.EAGER_LOADED>
  } = { };

  constructor(
    private apiService: ApiService,
    private profile$: ProfilesObservable,
    private tweetConverter: TweetConverter
  ) {
    if (!TweetStatefull.instance) {
      TweetStatefull.instance = this;
    }

    return TweetStatefull.instance;
  }

  get(idEvent: EventId): ITweet<DataLoadType.EAGER_LOADED> {
    return this.eagerTweets[idEvent];
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
    const events = await this.apiService.get([
      {
        kinds: [
          NostrEventKind.Text,
          NostrEventKind.Repost,
          NostrEventKind.Reaction
        ],
        '#e': idEvents
      }
    ]);

    tweets = this.tweetConverter.castResultsetToTweets(events);
    return Promise.resolve(tweets);
  }

  createLazyLoadableTweetFromEventId(idEvent: string, pubkey?: string): ITweet {
    const tweet: ITweet<DataLoadType.LAZY_LOADED> = {
      id: idEvent,
      reactions: new Array<IReaction>(),
      load: DataLoadType.LAZY_LOADED
    };

    if (pubkey) {
      tweet.author = this.profile$.castPubkeyToNostrPublic(pubkey);
    }

    return tweet;
  }
}