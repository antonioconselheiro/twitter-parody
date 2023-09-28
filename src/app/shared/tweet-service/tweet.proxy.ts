import { Injectable } from "@angular/core";
import { TEventId } from "@domain/event-id.type";
import { IProfile } from "@domain/profile.interface";
import { IRetweet } from "@domain/retweet.interface";
import { ITweet } from "@domain/tweet.interface";
import { ProfileCache } from "@shared/profile-service/profile.cache";
import { ProfileProxy } from "@shared/profile-service/profile.proxy";
import { TweetApi } from "./tweet.api";
import { TweetCache } from "./tweet.cache";
import { TweetConverter } from "./tweet.converter";

@Injectable()
export class TweetProxy {

  constructor(
    private tweetApi: TweetApi,
    private profileProxy: ProfileProxy,
    private tweetCache: TweetCache,
    private tweetConverter: TweetConverter
  ) { }

  get(idEvent: TEventId): ITweet | IRetweet {
    return TweetCache.get(idEvent);
  }

  async listTweetsFromNostrPublic(npub: string): Promise<
    Array<ITweet | IRetweet>
  > {
    const rawEvents = await this.tweetApi.listTweetsFrom(npub);
    const npubs1 = this.tweetCache.cache(rawEvents);
    const eventList = rawEvents.map(e => e.id);
    const relatedEvents = await this.tweetApi.loadRelatedEvents(eventList);
    const npubs2 = this.tweetCache.cache(relatedEvents);
    await this.profileProxy.loadProfiles(npubs1, npubs2);

    return rawEvents
      .map(event => this.tweetCache.get(event.id))
      .sort((tweetA, tweetB) => {
        if ('created' in tweetA && 'created' in tweetB) {
          return tweetB.created - tweetA.created;
        }

        return 0;
      });
  }

  async listReactionsFromNostrPublic(npub: string): Promise<
    Array<ITweet | IRetweet>
  > {
    const rawEvents = await this.tweetApi.listReactionsFrom(npub);
    const npubs1 = this.tweetCache.cache(rawEvents);
    const eventList = rawEvents.map(e => e.id);
    const relatedEvents = await this.tweetApi.loadRelatedEvents(eventList);
    const npubs2 = this.tweetCache.cache(relatedEvents);
    await this.profileProxy.loadProfiles(npubs1, npubs2);

    return rawEvents
      .map(event => this.tweetCache.get(event.id))
      .sort((tweetA, tweetB) => {
        if ('created' in tweetA && 'created' in tweetB) {
          return tweetA.created - tweetB.created;
        }

        return 0;
      });
  }

  /**
   * if the current tweet is just a retweet with no comment
   * the profile from the retweeted will be returned
   */
  //  FIXME: dar um jeito do template não precisar chamar
  //  diversas vezes um método com essa complexidade
  // eslint-disable-next-line complexity
  getTweetOrRetweetedAuthorProfile(tweet: ITweet): IProfile | null {
    if (this.tweetConverter.isSimpleRetweet(tweet)) {
      const retweeted = TweetCache.eagerTweets[tweet.retweeting] || TweetCache.lazyTweets[tweet.retweeting];
      if (retweeted.author) {
        return ProfileCache.profiles[retweeted.author];
      }
    }

    if (!tweet.author) {
      return null;
    }

    return ProfileCache.profiles[tweet.author] || null;
  }
}
