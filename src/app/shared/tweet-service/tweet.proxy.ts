import { Injectable } from "@angular/core";
import { TEventId } from "@domain/event-id.type";
import { NostrEventKind } from "@domain/nostr-event-kind";
import { IProfile } from "@domain/profile.interface";
import { IRetweet } from "@domain/retweet.interface";
import { ITweet } from "@domain/tweet.interface";
import { ProfileCache } from "@shared/profile-service/profile.cache";
import { ProfileProxy } from "@shared/profile-service/profile.proxy";
import { Event } from 'nostr-tools';
import { TweetApi } from "./tweet.api";
import { TweetCache } from "./tweet.cache";
import { TweetTypeGuard } from "./tweet.type-guard";

@Injectable()
export class TweetProxy {

  constructor(
    private tweetApi: TweetApi,
    private tweetTypeGuard: TweetTypeGuard,
    private profileProxy: ProfileProxy,
    private tweetCache: TweetCache
  ) { }

  get(idEvent: TEventId): ITweet | IRetweet {
    return TweetCache.get(idEvent);
  }

  async listTweetsFromNostrPublic(npub: string): Promise<
    Array<ITweet | IRetweet>
  > {
    const rawEvents = await this.tweetApi.listTweetsFrom([npub]);
    return this.loadRelatedEvents(rawEvents);
  }

  async listReactionsFromNostrPublic(npub: string): Promise<
    Array<ITweet | IRetweet>
  > {
    const rawEvents = await this.tweetApi.listReactionsFrom(npub);
    return this.loadRelatedEvents(rawEvents);
  }

  private async loadRelatedEvents(rawEvents: Event<NostrEventKind>[]): Promise<
    Array<ITweet | IRetweet>
  > {
    if (!rawEvents.length) {
      return Promise.resolve([]);
    }
debugger;
    const wrapperRoot = this.tweetCache.cache(rawEvents);
    const eventList = rawEvents.map(e => e.id);
    const relatedEvents = await this.tweetApi.loadRelatedEvents(eventList);
    const wrapperRelated = this.tweetCache.cache(relatedEvents);

    const lazyEvents = wrapperRoot.lazy.map(lazy => lazy.id);
    const lazyEagerLoaded = await this.tweetApi.loadRelatedEvents(lazyEvents);
    const wrapperLazyEagerLoaded = this.tweetCache.cache(lazyEagerLoaded);

    const relatedEventList = [...new Set(
      eventList
        .concat(wrapperRelated.eager.map(e => e.id))
        .concat(wrapperLazyEagerLoaded.eager.map(e => e.id))
    )];

    const reactions = await this.tweetApi.loadRelatedReactions(relatedEventList);
    const wrapperReactions = this.tweetCache.cache(reactions);

    await this.profileProxy.loadProfiles(
      wrapperRoot.npubs, wrapperRelated.npubs, wrapperLazyEagerLoaded.npubs, wrapperReactions.npubs
    );

    return rawEvents
      .map(event => this.tweetCache.get(event.id))
      .sort((tweetA, tweetB) => {
        if ('created' in tweetA && 'created' in tweetB) {
          return tweetB.created - tweetA.created;
        }

        return 0;
      }).filter(t => t);
  }

  /**
   * if the current tweet is just a retweet with no comment
   * the profile from the retweeted will be returned
   */
  //  FIXME: dar um jeito do template não precisar chamar
  //  diversas vezes um método com essa complexidade
  // eslint-disable-next-line complexity
  getTweetOrRetweetedAuthorProfile(tweet: ITweet): IProfile | null {
    if (this.tweetTypeGuard.isSimpleRetweet(tweet)) {
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
