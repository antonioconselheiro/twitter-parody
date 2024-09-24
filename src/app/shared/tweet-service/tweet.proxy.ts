import { Injectable } from "@angular/core";
import { NostrPool, ProfileService } from "@belomonte/nostr-ngx";
import { IRetweet } from "@domain/retweet.interface";
import { Tweet } from "@domain/tweet.interface";
import { NostrEvent } from 'nostr-tools';
import { TweetTagsConverter } from "./tweet-tags.converter";
import { TweetApi } from "./tweet.api";
import { TweetTypeGuard } from "./tweet.type-guard";

@Injectable({
  providedIn: 'root'
})
export class TweetProxy {

  constructor(
    private tweetApi: TweetApi,
    private tweetTypeGuard: TweetTypeGuard,
    private tweetTagsConverter: TweetTagsConverter,
    private profileService: ProfileService,
    private npool: NostrPool
  ) { }

  async listTweetsFromPubkey(pubkey: string): Promise<
    Array<Tweet | IRetweet>
  > {
    const rawEvents = await this.tweetApi.listTweetsFromPubkeyList([pubkey]);
    return this.loadRelatedEvents(rawEvents);
  }

  async listReactionsFromNostrPublic(pubkey: string): Promise<
    Array<Tweet | IRetweet>
  > {
    const rawEvents = await this.tweetApi.listReactionsFromPubkey(pubkey);
    return this.loadRelatedEvents(rawEvents);
  }

  private async loadRelatedEvents(rawEvents: NostrEvent[]): Promise<
    Array<Tweet | IRetweet>
  > {
    if (!rawEvents.length) {
      return Promise.resolve([]);
    }

    const wrapperRoot = this.tweetCache.cache(rawEvents);
    //  FIXME: trocar esta lógica para que sejam carregados todos os ids de eventos
    //  encontrados nos dados disponíveis dos eventos carregados, tlvz fazendo isso
    //  eu possa remover o carregamento do lazyEagerLoaded, que trás todos eventos
    //  de lazy load para eager load, pois ele faz uma consulta muita grande e pode
    //  afetar a experiência de uso do aplicativo
    //  A alteração também ajuda no carregamento de eventos relacionados que não estão
    //  sendo carregados, pois são citados apenas no content do event como nostr:note
    //  e não são associados nas tags :s
    //  https://github.com/users/antonioconselheiro/projects/1?pane=issue&itemId=41105788
    const eventList = rawEvents.map(e => e.id);
    const eventRelatedList = rawEvents.map(e => this.tweetTagsConverter
      .getRelatedEvents(e)
      .map(wrapper => wrapper[0])
    ).flat(1);

    const eventsToLoad = [...new Set(
      eventList.concat(eventRelatedList)
    )];

    const relatedEvents = await this.tweetApi.loadEvents(eventsToLoad);
    const wrapperRelated = this.tweetCache.cache(relatedEvents);

    // const lazyEvents = wrapperRoot.lazy.map(lazy => lazy.id);
    // const lazyEagerLoaded = await this.tweetApi.loadRelatedEvents(lazyEvents);
    // const wrapperLazyEagerLoaded = this.tweetCache.cache(lazyEagerLoaded);

    // const relatedEventList = [...new Set(
    //   eventList
    //     .concat(wrapperRelated.eager.map(e => e.id))
    //     .concat(wrapperLazyEagerLoaded.eager.map(e => e.id))
    // )];

    // const reactions = await this.tweetApi.loadRelatedReactions(relatedEventList);
    // const wrapperReactions = this.tweetCache.cache(reactions);

    await this.profileService.loadProfiles(
      wrapperRoot.npubs.concat(wrapperRelated.npubs) //, wrapperLazyEagerLoaded.npubs, wrapperReactions.npubs
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
  getTweetOrRetweetedAuthorProfile(tweet: Tweet): IProfile | null {
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
