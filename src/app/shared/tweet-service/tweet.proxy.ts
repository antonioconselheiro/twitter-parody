import { Injectable } from "@angular/core";
import { DataLoadType } from "@domain/data-load.type";
import { TEventId } from "@domain/event-id.type";
import { IRetweet } from "@domain/retweet.interface";
import { ITweet } from "@domain/tweet.interface";
import { ProfileProxy } from "@shared/profile-service/profile.proxy";
import { TweetApi } from "./tweet.api";
import { TweetCache } from "./tweet.cache";

@Injectable()
export class TweetProxy {

  constructor(
    private tweetApi: TweetApi,
    private profileProxy: ProfileProxy,
    private tweetCache: TweetCache
  ) { }

  get(idEvent: TEventId): ITweet<DataLoadType.EAGER_LOADED> | IRetweet {
    return TweetCache.get(idEvent);
  }

  async listTweetsFromNostrPublic(npub: string): Promise<
    Array<ITweet<DataLoadType.EAGER_LOADED> | IRetweet>
  > {
    const rawEvents = await this.tweetApi.listTweetsFrom(npub);
    this.tweetCache.cache(rawEvents);
    const relatedEvents = await this.tweetApi.loadRelatedEvents(rawEvents.map(e => e.id));
    const npubs = this.tweetCache.cache(relatedEvents);
    await this.profileProxy.loadProfiles(npubs);

    return rawEvents.map(event => this.tweetCache.get(event.id));
  }

  async listReactionsFromNostrPublic(npub: string): Promise<
    Array<ITweet<DataLoadType.EAGER_LOADED> | IRetweet>
  > {
    const rawEvents = await this.tweetApi.listReactionsFrom(npub);
    this.tweetCache.cache(rawEvents);
    const relatedEvents = await this.tweetApi.loadRelatedEvents(rawEvents.map(e => e.id));
    this.tweetCache.cache(relatedEvents);

    return rawEvents.map(event => this.tweetCache.get(event.id));
  }
}
