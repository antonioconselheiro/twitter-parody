import { Injectable } from "@angular/core";
import { DataLoadType } from "@domain/data-load.type";
import { TEventId } from "@domain/event-id.type";
import { IRetweet } from "@domain/retweet.interface";
import { ITweet } from "@domain/tweet.interface";
import { ProfileProxy } from "@shared/profile-service/profile.proxy";
import { TweetApi } from "./tweet.api";
import { TweetCache } from "./tweet.cache";
import { TweetConverter } from "./tweet.converter";
import { ProfileCache } from "@shared/profile-service/profile.cache";
import { IProfile } from "@domain/profile.interface";

@Injectable()
export class TweetProxy {

  constructor(
    private tweetApi: TweetApi,
    private profileProxy: ProfileProxy,
    private tweetCache: TweetCache,
    private tweetConverter: TweetConverter
  ) { }

  get(idEvent: TEventId): ITweet<DataLoadType.EAGER_LOADED> | IRetweet {
    return TweetCache.get(idEvent);
  }

  async listTweetsFromNostrPublic(npub: string): Promise<
    Array<ITweet<DataLoadType.EAGER_LOADED> | IRetweet>
  > {
    const rawEvents = await this.tweetApi.listTweetsFrom(npub);
    const npubs1 = this.tweetCache.cache(rawEvents);
    const eventList = rawEvents.map(e => e.id);
    const relatedEvents = await this.tweetApi.loadRelatedEvents(eventList);
    const npubs2 = this.tweetCache.cache(relatedEvents);
    await this.profileProxy.loadProfiles(npubs1, npubs2);

    return rawEvents.map(event => this.tweetCache.get(event.id));
  }

  async listReactionsFromNostrPublic(npub: string): Promise<
    Array<ITweet<DataLoadType.EAGER_LOADED> | IRetweet>
  > {
    const rawEvents = await this.tweetApi.listReactionsFrom(npub);
    const npubs1 = this.tweetCache.cache(rawEvents);
    const eventList = rawEvents.map(e => e.id);
    const relatedEvents = await this.tweetApi.loadRelatedEvents(eventList);
    const npubs2 = this.tweetCache.cache(relatedEvents);
    await this.profileProxy.loadProfiles(npubs1, npubs2);

    return rawEvents.map(event => this.tweetCache.get(event.id));
  }

  /**
   * if the current tweet is just a retweet with no comment
   * the profile from the retweeted will be returned
   */
  getTweetOrRetweetedAuthorProfile(tweet: ITweet<DataLoadType.EAGER_LOADED>): IProfile {
    //  FIXME: dar um jeito do template não precisar chamar
    //  diversas vezes um método com essa complexidade
    if (this.tweetConverter.isSimpleRetweet(tweet)) {
      const retweeted = TweetCache.eagerTweets[tweet.retweeting] || TweetCache.lazyTweets[tweet.retweeting];
      if (retweeted.author) {
        return ProfileCache.profiles[retweeted.author];
      }
    }

    return ProfileCache.profiles[tweet.author];
  }
}
