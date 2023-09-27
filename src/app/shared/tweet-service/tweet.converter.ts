import { Injectable } from '@angular/core';
import { DataLoadType } from '@domain/data-load.type';
import { TEventId } from '@domain/event-id.type';
import { NostrEventKind } from '@domain/nostr-event-kind';
import { TNostrPublic } from '@domain/nostr-public.type';
import { IReaction } from '@domain/reaction.interface';
import { IRetweet } from '@domain/retweet.interface';
import { ITweet } from '@domain/tweet.interface';
import { IZap } from '@domain/zap.interface';
import { HtmlfyService } from '@shared/htmlfy/htmlfy.service';
import { ProfileConverter } from '@shared/profile-service/profile.converter';
import { UrlUtil } from '@shared/util/url.service';
import Geohash from 'latlon-geohash';
import { Event } from 'nostr-tools';
import { ITweetRelatedInfoWrapper } from './tweet-related-info-wrapper.interface';

@Injectable({
  providedIn: 'root'
})
export class TweetConverter {

  constructor(
    private urlUtil: UrlUtil,
    private htmlfyService: HtmlfyService,
    private profilesConverter: ProfileConverter
  ) { }

  private isKind<T extends NostrEventKind>(event: Event<NostrEventKind>, kind: T): event is Event<T>  {
    return event.kind === kind;
  }

  castResultsetToTweets(events: Event<NostrEventKind>[]): ITweetRelatedInfoWrapper {

    const timeline: ITweetRelatedInfoWrapper = {
      eager: [],
      lazy: [],
      npubs: []
    };

    // eslint-disable-next-line complexity
    events.forEach(event => {
      if (this.isKind(event, NostrEventKind.Text)) {
        const { tweet, npubs } = this.castEventToTweet(event);
        timeline.eager.push(tweet);
        timeline.npubs = timeline.npubs.concat(npubs);
      } else if (this.isKind(event, NostrEventKind.Repost)) {
        const { retweet, tweet, npubs } = this.castEventToRetweet(event);
        timeline.eager.push(retweet);
        if (tweet.load === DataLoadType.LAZY_LOADED) {
          timeline.lazy.push(tweet);
        } else {
          timeline.eager.push(tweet);
        }
        timeline.npubs = timeline.npubs.concat(npubs);
      } else if (this.isKind(event, NostrEventKind.Reaction)) {
        const { lazy, npubs } = this.castEventReactionToLazyLoadTweet(event);
        timeline.lazy.push(lazy);
        timeline.npubs = timeline.npubs.concat(npubs);
      } else if (this.isKind(event, NostrEventKind.Zap)) {
        const { lazy, npubs } = this.castEventZapToLazyLoadTweet(event);
        timeline.lazy.push(lazy);
        timeline.npubs = timeline.npubs.concat(npubs);
      }
    });

    timeline.npubs = [...new Set(timeline.npubs)];

    return timeline;
  }

  getTweetReactions(tweet?: ITweet | null): number {
    return tweet && Object.keys(tweet.reactions).length || 0;
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

  private castEventToRetweet(event: Event<NostrEventKind.Repost>): {
    retweet: IRetweet, tweet: ITweet, npubs: TNostrPublic[]
  } {
    const content = this.getTweetContent(event);
    const author = this.getAuthorNostrPublicFromEvent(event);
    let npubs: string[] = [ author ];
    let retweeted: ITweet;

    if (content) {
      const retweetedEvent: Event<NostrEventKind.Text> = JSON.parse(content);
      const { tweet, npubs: npubs2 } = this.castEventToTweet(retweetedEvent);
      retweeted = tweet;
      npubs = npubs.concat(npubs2);
    } else {
      const [[, idEvent],[,pubkey]] = event.tags;
      retweeted = this.createLazyLoadableTweetFromEventId(idEvent, pubkey);
    }

    const retweetAsTweet: Event<NostrEventKind.Text> = { ...event, content: '', kind: NostrEventKind.Text };
    const { tweet: retweet, npubs: npubs3 } = this.castEventToTweet(retweetAsTweet, retweeted.id);
    npubs = npubs.concat(npubs3);

    retweeted.retweetedBy = [event.id];

    return {
      retweet, tweet: retweeted, npubs
    };
  }

  private castEventZapToLazyLoadTweet(event: Event<NostrEventKind.Zap>): {
    lazy: ITweet<DataLoadType.LAZY_LOADED>, npubs: TNostrPublic[]
  } {
    const [ [, idEvent], [, pubkey] ] = event.tags;
    const npub = this.profilesConverter.castPubkeyToNostrPublic(pubkey);
    const npubs = [ npub ];

    const reaction: IZap = {
      id: event.id,
      author: npub,
      content: event.content,
      tweet: idEvent
    };

    const lazy = this.createLazyLoadableTweetFromEventId(idEvent);
    lazy.zaps[event.id] = reaction;

    return { lazy, npubs };
  }

  private castEventReactionToLazyLoadTweet(event: Event<NostrEventKind.Reaction>): {
    lazy: ITweet<DataLoadType.LAZY_LOADED>, npubs: TNostrPublic[]
  } {
    const [ [, idEvent], [, pubkey] ] = event.tags;
    const npub = this.profilesConverter.castPubkeyToNostrPublic(pubkey);
    const npubs = [ npub ];

    const reaction: IReaction = {
      id: event.id,
      author: this.profilesConverter.castPubkeyToNostrPublic(pubkey),
      content: event.content,
      tweet: idEvent
    };

    const lazy = this.createLazyLoadableTweetFromEventId(idEvent);
    lazy.reactions[event.id] = reaction;

    return { lazy, npubs };
  }

  createLazyLoadableTweetFromEventId(
    idEvent: string, pubkey?: string
  ): ITweet<DataLoadType.LAZY_LOADED> {
    const tweet: ITweet<DataLoadType.LAZY_LOADED> = {
      id: idEvent,
      reactions: {},
      zaps: {},
      load: DataLoadType.LAZY_LOADED
    };

    if (pubkey) {
      tweet.author = this.profilesConverter.castPubkeyToNostrPublic(pubkey);
    }

    return tweet;
  }

  getAuthorNostrPublicFromEvent(event: Event): TNostrPublic {
    return this.profilesConverter.castPubkeyToNostrPublic(event.pubkey);
  }

  private castEventToTweet(event: Event<NostrEventKind.Text>, retweeting: TEventId): {
    tweet: IRetweet, npubs: Array<string>
  };
  private castEventToTweet(event: Event<NostrEventKind.Text>): {
    tweet: ITweet<DataLoadType.EAGER_LOADED>, npubs: Array<string>
  };
  private castEventToTweet(event: Event<NostrEventKind.Text>, retweeting?: TEventId): {
    tweet: ITweet<DataLoadType.EAGER_LOADED> | IRetweet, npubs: Array<string>
  } {
    const content = this.getTweetContent(event);
    const { urls, imgList, imgMatriz } = this.htmlfyService.separateImageAndLinks(content);
    const htmlSmallView = this.htmlfyService.safify(this.getSmallView(content, imgList));
    const htmlFullView = this.htmlfyService.safify(this.getFullView(content, imgList));
    const author = this.getAuthorNostrPublicFromEvent(event);
    let npubs: string[] = [ author ];

    const tweet: ITweet<DataLoadType.EAGER_LOADED> = {
      id: event.id,
      author, content, htmlSmallView,
      htmlFullView, urls, imgList, imgMatriz,
      reactions: {},
      zaps: {},
      created: this.getTweetCreated(event),
      load: DataLoadType.EAGER_LOADED,
    };

    if (retweeting) {
      tweet.retweeting = retweeting;
    }

    npubs = npubs.concat(this.getNostrPublicFromTags(event));
    this.getCoordinatesFromEvent(tweet, event);
    this.getRetweetingFromEvent(tweet, event);

    return { tweet, npubs };
  }

  private getNostrPublicFromTags(event: Event): TNostrPublic[] {
    return event.tags
      .filter(([type]) => type === 'p')
      .map(([,npub]) => npub);
  }

  private getRetweetingFromEvent(tweet: ITweet, event: Event<NostrEventKind>): void {
    if (this.isKind(event, NostrEventKind.Repost)) {
      const [[,idEvent], [, pubkey]] = event.tags;
      tweet.author = this.profilesConverter.castPubkeyToNostrPublic(pubkey);
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

  extractEventsAndNPubsFromTweets(tweets: ITweet[]): TEventId[] {
    return tweets.map(tweet => {
      const replies = tweet.replies || [];
      const repling = tweet.repling ? [tweet.repling] : [];
      const retweetedBy = tweet.retweetedBy || [];
      const retweeting = tweet.retweeting ? [tweet.retweeting] : [];
      
      return [ ...replies, ...repling, ...retweetedBy, ...retweeting ];
    }).flat(1);
  }
}
