import { Injectable } from '@angular/core';
import { DataLoadType } from '@domain/data-load.type';
import { EventId } from '@domain/event-id.type';
import { NostrEventKind } from '@domain/nostr-event-kind';
import { IReaction } from '@domain/reaction.interface';
import { IRetweet } from '@domain/retweet.interface';
import { ITweet } from '@domain/tweet.interface';
import { IZap } from '@domain/zap.interface';
import { ProfileConverter } from '@shared/profile-service/profile.converter';
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
    private profilesConverter: ProfileConverter
  ) { }

  private isKind<T extends NostrEventKind>(event: Event<NostrEventKind>, kind: T): event is Event<T>  {
    return event.kind === kind;
  }

  castResultsetToTweets(events: Event<NostrEventKind>[]): {
    tweets: ITweet<DataLoadType.EAGER_LOADED>,
    lazy: ITweet<DataLoadType.LAZY_LOADED>,
    reactions: Array<IReaction>,
    zap: Array<IZap>
  }[] {

    const timeline = {
      eager: [],
      lazy: [],
      reactions: [],
      zap: [],
    };

    // eslint-disable-next-line complexity
    events.forEach(event => {
      if (this.isKind(event, NostrEventKind.Text)) {
        timeline.eager.push(this.castEventToTweet(event));
      } else if (this.isKind(event, NostrEventKind.Repost)) {
        const { retweet, tweet } = timeline.eager.push(this.castEventToRetweet(event));
        timeline.eager.push(retweet);
        if (tweet.load === DataLoadType.LAZY_LOADED) {
          timeline.lazy.push(retweet);
        } else {
          timeline.eager.push(retweet);
        }
      } else if (this.isKind(event, NostrEventKind.Reaction)) {
        const { reaction, lazy } = this.castEventToReaction(event)
        timeline.reactions.push(reaction);
        timeline.lazy.push(lazy);
      } else if (this.isKind(event, NostrEventKind.Zap)) {
        const { zap, lazy } = this.castEventToZap(event)
        timeline.zap.push(zap);
        timeline.lazy.push(lazy);
      }
    });

    return timeline;
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

  private castEventToRetweet(event: Event<NostrEventKind.Repost>): { retweet: IRetweet, tweet: ITweet } {
    const content = this.getTweetContent(event);
    let retweeted: ITweet;

    if (content) {
      const retweetedEvent: Event<NostrEventKind.Text> = JSON.parse(content);
      retweeted = this.castEventToTweet(retweetedEvent);
      
    } else {
      const [[, idEvent],[,pubkey]] = event.tags;
      retweeted = this.createLazyLoadableTweetFromEventId(idEvent, pubkey);
    }

    const retweetAsTweet: Event<NostrEventKind.Text> = { ...event, content: '', kind: NostrEventKind.Text };
    const retweet = this.castEventToTweet(retweetAsTweet, retweeted.id);
    
    retweeted.retweetedBy = [event.id];

    return {
      retweet, tweet: retweeted
    };
  }

  private castEventToZap(event: Event<NostrEventKind.Zap>): IZap {
    
    // TODO: 
    return {} as IZap;
  }

  private castEventToReaction(event: Event<NostrEventKind.Reaction>): IReaction {
    const [ [, idEvent], [, pubkey] ] = event.tags;

    const reaction: IReaction = {
      id: event.id,
      author: this.profilesConverter.castPubkeyToNostrPublic(pubkey),
      content: event.content,
      tweet: idEvent
    };

    return reaction;
  }

  createLazyLoadableTweetFromEventId(
    idEvent: string, pubkey?: string
  ): ITweet<DataLoadType.LAZY_LOADED> {
    const tweet: ITweet<DataLoadType.LAZY_LOADED> = {
      id: idEvent,
      reactions: new Array<IReaction>(),
      load: DataLoadType.LAZY_LOADED
    };

    if (pubkey) {
      tweet.author = this.profilesConverter.castPubkeyToNostrPublic(pubkey);
    }

    return tweet;
  }

  private castEventToTweet(event: Event<NostrEventKind.Text>, retweeting: EventId): IRetweet;
  private castEventToTweet(event: Event<NostrEventKind.Text>): ITweet<DataLoadType.EAGER_LOADED>;
  private castEventToTweet(event: Event<NostrEventKind.Text>, retweeting?: EventId): ITweet<DataLoadType.EAGER_LOADED> | IRetweet;
  private castEventToTweet(event: Event<NostrEventKind.Text>, retweeting?: EventId): ITweet<DataLoadType.EAGER_LOADED> {
    const content = this.getTweetContent(event);

    const { urls, imgList, imgMatriz } = this.tweetHtmlfyService.separateImageAndLinks(content);
    const htmlSmallView = this.tweetHtmlfyService.safify(this.getSmallView(content, imgList));
    const htmlFullView = this.tweetHtmlfyService.safify(this.getFullView(content, imgList));

    const tweet: ITweet<DataLoadType.EAGER_LOADED> = {
      id: event.id,
      author: this.profilesConverter.castPubkeyToNostrPublic(event.pubkey),
      content, htmlSmallView, htmlFullView,
      urls, imgList, imgMatriz,
      reactions: [],
      created: this.getTweetCreated(event),
      load: DataLoadType.EAGER_LOADED,
    };

    if (retweeting) {
      tweet.retweeting = retweeting;
    }

    this.getCoordinatesFromEvent(tweet, event);
    this.getRetweetingFromEvent(tweet, event);

    return tweet;
  }

  private getRetweetingFromEvent(tweet: ITweet, event: Event<NostrEventKind>): IRetweet {
    if (this.isKind(event, NostrEventKind.Repost)) {
      const [[,idEvent], [, pubkey]] = event.tags;

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

  private getTweetContent(event: Event<NostrEventKind.Text | NostrEventKind.Repost>): string {
    return event.content || '';
  }

  private getTweetCreated(event: Event<NostrEventKind.Text | NostrEventKind.Repost>): number {
    return event.created_at || 0;
  }
}
