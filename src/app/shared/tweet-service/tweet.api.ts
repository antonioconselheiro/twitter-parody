import { Injectable } from "@angular/core";
import { NostrEventKind } from "@domain/nostr-event-kind";
import { NostrUser } from "@domain/nostr-user";
import { IReaction } from "@domain/reaction.interface";
import { DataLoadType } from "@domain/data-load-type";
import { ITweet } from "@domain/tweet.interface";
import { ApiService } from "@shared/api-service/api.service";
import { Event } from 'nostr-tools';
import { ProfilesObservable } from "../profile-service/profiles.observable";
import Geohash from "latlon-geohash";
import { TweetHtmlfyService } from "./tweet-htmlfy.service";
import { UrlUtil } from "@shared/util/url.service";

@Injectable({
  providedIn: 'root'
})
export class TweetApi {

  constructor(
    private urlUtil: UrlUtil,
    private apiService: ApiService,
    private tweetHtmlfyService: TweetHtmlfyService,
    private profiles$: ProfilesObservable
  ) { }

  async listTweetsFrom(npub: string): Promise<ITweet[]> {
    const events = await this.apiService.get([
      {
        kinds: [
          NostrEventKind.Metadata,
          NostrEventKind.Text,
          NostrEventKind.Repost
        ],
        authors: [
          String(new NostrUser(npub))
        ],
        limit: 20
      }
    ]);

    this.profiles$.cache(events);

    const tweets = this.castResultsetToTweets(events);
    return Promise.resolve(tweets);
  }

  async listReactionsFrom(npub: string): Promise<ITweet[]> {
    const events = await this.apiService.get([
      {
        kinds: [
          NostrEventKind.Metadata,
          NostrEventKind.Reaction
        ],
        authors: [
          String(new NostrUser(npub))
        ],
        limit: 20
      }
    ]);

    this.profiles$.cache(events);

    const tweets = this.castResultsetToTweets(events);
    return Promise.resolve(tweets);
  }

  async listTweetsInteractions(tweets: ITweet[]): Promise<ITweet[]> {
    const events = await this.apiService.get([
      {
        kinds: [
          NostrEventKind.Metadata,
          NostrEventKind.Text,
          NostrEventKind.Repost,
          NostrEventKind.Reaction
        ],
        ids: tweets.map(tweet => tweet.id)
      }
    ]);

    this.profiles$.cache(events);

    tweets = this.castResultsetToTweets(events, tweets);
    return Promise.resolve(tweets);
  }

  private isKind<T extends NostrEventKind>(event: Event<NostrEventKind>, kind: T): event is Event<T>  {
    return event.kind === kind;
  }

  private castResultsetToTweets(events: Event<NostrEventKind>[], tweets: ITweet[] = []): ITweet[] {
    const tweetsMap: { [id: string]: ITweet } = {};
    tweets.forEach(tweet => tweetsMap[tweet.id] = tweet);

    //  FIXME: débito técnico, resolver complexidade ciclomática
    // eslint-disable-next-line complexity
    events.forEach(event => {
      if (this.isKind(event, NostrEventKind.Text) || this.isKind(event, NostrEventKind.Repost)) {
        this.castAndCacheEventToTweet(tweetsMap, event);
      }

      if (this.isKind(event, NostrEventKind.Reaction)) {
        const [ [, idEvent], [, pubkey] ] = event.tags;

        const reaction: IReaction = {
          author: this.profiles$.getFromPubKey(pubkey),
          content: event.content
        };

        if (!tweetsMap[idEvent]) {
          tweetsMap[idEvent] = this.createLazyLoadableTweetFromEventId(idEvent);
        }

        tweetsMap[idEvent].reactions.push(reaction);
      }
    });

    return Object.values(tweetsMap);
  }

  private getSmallView(tweet: string, imgList: string[]): string {
    const maxLength = 280;
    let content = this.getFullView(tweet, imgList);
    if (content.length > maxLength) {
      content = content.substring(0, maxLength - 1);
      //  substituí eventual link cortado pela metade
      content = content.replace(/http[^ ]+$/, '');
      content += '…';
    }

    return content;
  }

  private getFullView(tweet: string, imgList: string[]): string {
    imgList?.forEach(img => tweet = tweet.replace(this.urlUtil.regexFromLink(img), ''))
    return tweet;
  }

  // eslint-disable-next-line complexity
  private castAndCacheEventToTweet(tweetsMap: { [id: string]: ITweet }, event: Event<NostrEventKind.Text>): ITweet;
  private castAndCacheEventToTweet(tweetsMap: { [id: string]: ITweet }, event: Event<NostrEventKind.Repost>): ITweet;
  private castAndCacheEventToTweet(tweetsMap: { [id: string]: ITweet }, event: Event<NostrEventKind.Text | NostrEventKind.Repost>): ITweet;
  private castAndCacheEventToTweet(tweetsMap: { [id: string]: ITweet }, event: Event<NostrEventKind.Text> | Event<NostrEventKind.Repost>): ITweet {
    const lazyLoaded = tweetsMap[event.id];
    const content = this.getTweetContent(event, lazyLoaded);

    const { urls, imgList, imgMatriz } = this.tweetHtmlfyService.separateImageAndLinks(content);
    const htmlSmallView = this.tweetHtmlfyService.safify(this.getSmallView(content, imgList));
    const htmlFullView = this.tweetHtmlfyService.safify(this.getFullView(content, imgList));

    const tweet = tweetsMap[event.id] = {
      id: event.id,
      author: this.profiles$.getFromPubKey(event.pubkey),
      content, htmlSmallView, htmlFullView,
      urls, imgList, imgMatriz,
      reactions: lazyLoaded?.reactions || [],
      reply: lazyLoaded?.reply || [],
      created: this.getTweetCreated(event, lazyLoaded),
      load: DataLoadType.EAGER_LOADED,
    }

    this.getCoordinatesFromEvent(tweet, event);
    this.getRetweetingFromEvent(tweetsMap, tweet, event);

    return tweet;
  }

  private getRetweetingFromEvent(tweetsMap: { [idEvent: string]: ITweet }, tweet: ITweet, event: Event<NostrEventKind>): void {
    if (this.isKind(event, NostrEventKind.Repost)) {
      const [[,idEvent], [, pubkey]] = event.tags;

      if (!tweetsMap[idEvent]) {
        tweet = tweetsMap[idEvent] = this.createLazyLoadableTweetFromEventId(idEvent, pubkey);
      }

      tweetsMap[event.id].retweeting = tweetsMap[idEvent];
    }
  }
  
  private getCoordinatesFromEvent(tweet: ITweet, event: Event<NostrEventKind>): ITweet {
    const [,geohash] = event.tags.find(tag => tag[0] === 'g') || [];
    if (geohash) {
      tweet.location = Geohash.decode(geohash);
    }

    return tweet;
  }

  private createLazyLoadableTweetFromEventId(idEvent: string, pubkey?: string): ITweet {
    const tweet: ITweet = {
      id: idEvent,
      reactions: new Array<IReaction>(),
      load: DataLoadType.LAZY_LOADED
    };

    if (pubkey) {
      tweet.author = this.profiles$.getFromPubKey(pubkey);
    }

    return tweet;
  }

  private getTweetContent(event: Event<NostrEventKind.Text | NostrEventKind.Repost>, tweet?: ITweet): string {
    return event.content || tweet?.content || '';
  }

  private getTweetCreated(event: Event<NostrEventKind.Text | NostrEventKind.Repost>, tweet?: ITweet): number {
    return event.created_at || tweet?.created || 0;
  }

}