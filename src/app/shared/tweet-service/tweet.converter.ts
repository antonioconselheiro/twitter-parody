import { Injectable } from '@angular/core';
import { DataLoadType } from '@domain/data-load.type';
import { NostrEventKind } from '@domain/nostr-event-kind';
import { IReaction } from '@domain/reaction.interface';
import { ITweet } from '@domain/tweet.interface';
import { ProfilesObservable } from '@shared/profile-service/profiles.observable';
import { UrlUtil } from '@shared/util/url.service';
import Geohash from 'latlon-geohash';
import { Event } from 'nostr-tools';
import { TweetHtmlfyService } from './tweet-htmlfy.service';

@Injectable({
  providedIn: 'root'
})
export class TweetConverter {

  constructor(
    private urlUtil: UrlUtil,
    private tweetHtmlfyService: TweetHtmlfyService,
    private profiles$: ProfilesObservable
  ) { }

  private isKind<T extends NostrEventKind>(event: Event<NostrEventKind>, kind: T): event is Event<T>  {
    return event.kind === kind;
  }

  castResultsetToTweets(events: Event<NostrEventKind>[]): ITweet<DataLoadType.EAGER_LOADED>[] {
    const tweetsMap: { [id: string]: ITweet<DataLoadType.EAGER_LOADED> } = {};

    events.forEach(event => {
      if (this.isKind(event, NostrEventKind.Text)) {
        this.castAndCacheEventToTweet(tweetsMap, event);
      } else if (this.isKind(event, NostrEventKind.Repost)) {
        this.castAndCacheEventToRetweet(tweetsMap, event);
      } else if (this.isKind(event, NostrEventKind.Reaction)) {
        this.castAndCacheEventToReaction(tweetsMap, event);
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

  private castAndCacheEventToRetweet(tweetsMap: { [id: string]: ITweet }, event: Event<NostrEventKind.Repost>): ITweet {
    const lazyLoaded = tweetsMap[event.id];
    const content = this.getTweetContent(event, lazyLoaded);
    let retweeted: ITweet;

    if (content) {
      const retweetedEvent: Event<NostrEventKind.Text> = JSON.parse(content);
      retweeted = this.castAndCacheEventToTweet(tweetsMap, retweetedEvent);
      
    } else {
      const [[, idEvent],[,pubkey]] = event.tags;
      retweeted = this.createLazyLoadableTweetFromEventId(idEvent, pubkey);
    }

    const retweetAsTweet: Event<NostrEventKind.Text> = { ...event, content: '', kind: NostrEventKind.Text };
    const tweet = this.castAndCacheEventToTweet(tweetsMap, retweetAsTweet);
    
    retweeted.retweetedBy = [event.id];
    tweet.retweeting = retweeted.id;
    return tweet;

  }

  private castAndCacheEventToReaction(tweetsMap: { [id: string]: ITweet }, event: Event<NostrEventKind.Reaction>): void {
    const [ [, idEvent], [, pubkey] ] = event.tags;

    const reaction: IReaction = {
      id: event.id,
      author: this.profiles$.castPubkeyToNostrPublic(pubkey),
      content: event.content,
      tweet: idEvent
    };

    if (!tweetsMap[idEvent]) {
      tweetsMap[idEvent] = this.createLazyLoadableTweetFromEventId(idEvent);
    }

    tweetsMap[idEvent].reactions.push(reaction);
  }

  //  FIXME: debt
  // eslint-disable-next-line complexity
  private castAndCacheEventToTweet(tweetsMap: { [id: string]: ITweet }, event: Event<NostrEventKind.Text>): ITweet {
    const lazyLoaded = tweetsMap[event.id];
    const content = this.getTweetContent(event, lazyLoaded);

    const { urls, imgList, imgMatriz } = this.tweetHtmlfyService.separateImageAndLinks(content);
    const htmlSmallView = this.tweetHtmlfyService.safify(this.getSmallView(content, imgList));
    const htmlFullView = this.tweetHtmlfyService.safify(this.getFullView(content, imgList));

    const tweet = tweetsMap[event.id] = {
      id: event.id,
      author: this.profiles$.castPubkeyToNostrPublic(event.pubkey),
      content, htmlSmallView, htmlFullView,
      urls, imgList, imgMatriz,
      reactions: lazyLoaded?.reactions || [],
      repling: lazyLoaded?.repling,
      retweetedBy: lazyLoaded?.retweetedBy,
      retweeting: lazyLoaded?.retweeting,
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
        tweetsMap[idEvent] = this.createLazyLoadableTweetFromEventId(idEvent, pubkey);
      }

      tweet.retweeting = idEvent;
    }
  }
  
  private getCoordinatesFromEvent(
    tweet: ITweet<DataLoadType.EAGER_LOADED>,
    event: Event<NostrEventKind>
  ): ITweet<DataLoadType.EAGER_LOADED> {
    const [,geohash] = event.tags.find(tag => tag[0] === 'g') || [];
    if (geohash) {
      tweet.location = Geohash.decode(geohash);
    }

    return tweet;
  }

  private createLazyLoadableTweetFromEventId(idEvent: string, pubkey?: string): ITweet {
    const tweet: ITweet<DataLoadType.LAZY_LOADED> = {
      id: idEvent,
      reactions: new Array<IReaction>(),
      load: DataLoadType.LAZY_LOADED
    };

    if (pubkey) {
      tweet.author = this.profiles$.castPubkeyToNostrPublic(pubkey);
    }

    return tweet;
  }

  private getTweetContent(event: Event<NostrEventKind.Text | NostrEventKind.Repost>, tweet?: ITweet): string {
    return event.content || tweet && 'content' in tweet && tweet?.content || '';
  }

  private getTweetCreated(event: Event<NostrEventKind.Text | NostrEventKind.Repost>, tweet?: ITweet): number {
    return event.created_at || tweet && 'created' in tweet && tweet?.created || 0;
  }
}
