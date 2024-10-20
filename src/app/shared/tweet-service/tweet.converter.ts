import { Injectable } from '@angular/core';
import { NostrConverter, NostrGuard, NPub } from '@belomonte/nostr-ngx';
import { Reaction } from 'src/app/deprecated-domain/reaction.interface';
import { Retweet } from 'src/app/deprecated-domain/retweet.interface';
import { Tweet } from 'src/app/deprecated-domain/tweet.interface';
import { Zap } from 'src/app/deprecated-domain/zap.interface';
import { HtmlfyService } from '@shared/htmlfy/htmlfy.service';
import { Event, kinds, NostrEvent } from 'nostr-tools';
import { TweetRelationedInfoWrapper } from './tweet-relationed-info-wrapper.interface';
import { TweetTagsConverter } from './tweet-tags.converter';
import { TweetTypeGuard } from './tweet.type-guard';

@Injectable({
  providedIn: 'root'
})
export class TweetConverter {

  constructor(
    private guard: NostrGuard,
    private tweetTagsConverter: TweetTagsConverter,
    private htmlfyService: HtmlfyService,
    private tweetTypeGuard: TweetTypeGuard,
    private nostrConverter: NostrConverter
  ) { }

  castResultsetToTweets(events: NostrEvent[]): TweetRelationedInfoWrapper {
    const relationed: TweetRelationedInfoWrapper = {
      eager: [],
      lazy: [],
      pubkeys: []
    };

    //  FIXME: resolver débito de complexidade ciclomática
    // TODO: check in tags if tweets have mentions and then, create the threadfy method
    // eslint-disable-next-line complexity
    events.forEach(event => {
      const isSimpleText = this.guard.isKind(event, kinds.ShortTextNote);
      const isRepost = this.guard.isKind(event, kinds.Repost);
      const isReaction = this.guard.isKind(event, kinds.Reaction);
      const isZap = this.guard.isKind(event, kinds.Zap);

      if (isSimpleText) {
        //  FIXME: https://github.com/users/antonioconselheiro/projects/1/views/1?pane=issue&itemId=41105788
        const { retweeted, tweet, npubs } = this.castEventToTweet(event);
        relationed.eager.push(tweet);

        if (retweeted) {
          relationed.eager.push(retweeted);
        }

        relationed.pubkeys = relationed.pubkeys.concat(npubs);
      } else if (isRepost) {
        const { retweet, retweeted, npubs } = this.castEventToRetweet(event);
        if (retweet) {
          relationed.eager.push(retweet);
        }


        relationed.eager.push(retweeted);
        relationed.pubkeys = relationed.pubkeys.concat(npubs);
      } else if (isReaction) {
        const result = this.castEventReactionToLazyLoadTweet(event);
        if (result) {
          const { lazy, npubs } = result;
          relationed.lazy.push(lazy);
          relationed.pubkeys = relationed.pubkeys.concat(npubs);
        }
      } else if (isZap) {
        const result = this.castEventZapToLazyLoadTweet(event);
        if (result) {
          const { lazy, npubs } = result;
          relationed.lazy.push(lazy);
          relationed.pubkeys = relationed.pubkeys.concat(npubs);
        }
      }
    });

    relationed.pubkeys = [...new Set(relationed.pubkeys)];

    return relationed;
  }

  getTweetReactionsLength(tweet?: Tweet | null): number {
    if (!tweet) {
      return 0;
    }

    tweet = this.tweetTypeGuard.getShowingTweet(tweet);
    return Object.keys(tweet.reactions).length;
  }

  getRetweetedLength(tweet: Tweet | Retweet): number {
    tweet = this.tweetTypeGuard.getShowingTweet(tweet);
    return Object.keys(tweet.retweetedBy || {}).length || 0;
  }

  private getSmallView(content: string): string {
    const maxLength = 280;
    if (content.replace(/nostr:[^\s]+/g, '').length > maxLength) {
      content = content.substring(0, maxLength - 1);
      //  substituí eventual link cortado pela metade
      content = content.replace(/http[^ ]+$/, '');
      content += '…';
    }

    return content;
  }

  extractNostrEvent(content: object | string): Event | false {
    let event: object;
    if (typeof content === 'string') {
      try {
        event = JSON.parse(content);
      } catch {
        return false;
      }
    } else {
      event = content;
    }

    if (this.guard.isNostrEvent(event)) {
      return event;
    }

    return false;
  }

  // FIXME: débito, o método atingiu alta complexidade ciclomática,
  //  remover o disable do lint quando resolver débito
  // eslint-disable-next-line complexity
  private castEventToRetweet(event: NostrEvent): {
    retweet: Retweet, retweeted: Tweet, npubs: NPub[]
  } {
    let content = this.getTweetContent(event);
    const author = this.getAuthorNostrPublicFromEvent(event);
    let npubs: NPub[] = [author];
    let retweeted: Tweet;

    const contentEvent = this.extractNostrEvent(content);

    if (contentEvent) {
      const retweetedEvent: NostrEvent = contentEvent;
      const { tweet, npubs: npubs2 } = this.castEventToTweet(retweetedEvent);
      retweeted = tweet;
      npubs = npubs.concat(npubs2);
    } else {
      let idEvent = this.tweetTagsConverter.getMentionedEvent(event);
      if (!idEvent) {
        idEvent = this.tweetTagsConverter.getFirstRelatedEvent(event);
        if (!idEvent) {
          console.warn('[RELAY DATA WARNING] mentioned tweet not found in retweet', event);
        }
      }

      const pubkey = this.tweetTagsConverter.getRelatedProfiles(event);
      //  TODO: validate it use pubkey.at(0) here is secure in retweeted events
      retweeted = this.createLazyLoadableTweetFromEventId(idEvent || '', pubkey.at(0));
    }

    const retweetIdentifier = /(#\[0\])|(nostr:note[\da-z]+)/;
    content = content.replace(retweetIdentifier, '').trim();
    if (this.tweetTypeGuard.isSerializedNostrEvent(content)) {
      content = '';
    }

    const retweetAsTweet: NostrEvent = { ...event, content, kind: kinds.ShortTextNote };
    const { tweet: retweet, npubs: npubs2 } = this.castEventToTweet(retweetAsTweet, retweeted.id);
    npubs = npubs.concat(npubs2);
    if (retweeted.author) {
      npubs.push(retweeted.author);
    }

    retweeted.retweetedBy = {
      [event.id]: author
    };

    return {
      retweet, retweeted, npubs
    };
  }

  private castEventZapToLazyLoadTweet(event: NostrEvent): {
    lazy: Tweet<DataLoadType.LAZY_LOADED>, npubs: NPub[]
  } | null {
    const idEvent = this.tweetTagsConverter.getFirstRelatedEvent(event);
    const pubkey = this.tweetTagsConverter.getFirstRelatedProfile(event);
    if (!idEvent || !pubkey) {
      console.warn('[RELAY DATA WARNING] event not tagged with event and/or pubkey: ', event);
      return null;
    }

    const npub = this.nostrConverter.castPubkeyToNpub(pubkey);
    const npubs = [npub];

    const reaction: Zap = {
      id: event.id,
      author: npub,
      content: event.content,
      tweet: idEvent
    };

    const lazy = this.createLazyLoadableTweetFromEventId(idEvent);
    lazy.zaps[event.id] = reaction;

    return { lazy, npubs };
  }

  private castEventReactionToLazyLoadTweet(event: NostrEvent): {
    lazy: Tweet<DataLoadType.LAZY_LOADED>, npubs: NPub[]
  } | null {
    const idEvent = this.tweetTagsConverter.getFirstRelatedEvent(event);
    if (!idEvent) {
      console.warn('[RELAY DATA WARNING] reaction not tagged with event: ', event);
      return null;
    }

    const npub = this.nostrConverter.castPubkeyToNpub(event.pubkey);
    const npubs = [npub];

    const reaction: Reaction = {
      id: event.id,
      content: event.content,
      tweet: idEvent,
      author: npub
    };

    const lazy = this.createLazyLoadableTweetFromEventId(idEvent);
    lazy.reactions[event.id] = reaction;

    return { lazy, npubs };
  }

  getAuthorNostrPublicFromEvent(event: Event): NPub {
    return this.nostrConverter.castPubkeyToNpub(event.pubkey);
  }

  private instanceTweet(event: NostrEvent, author: NPub): Tweet {
    const content = this.getTweetContent(event);
    const { urls, imageList, videoUrl, imgMatriz } = this.htmlfyService.separateImageAndLinks(content);

    const tweet: Tweet = {
      id: event.id, author, reactions: {},
      zaps: {}, created: this.getTweetCreated(event),
      content, htmlSmallView: '', htmlFullView: '',
      urls, imageList, videoUrl, imgMatriz
    };

    /**
     * Getter and setter to access this data because mentions depend on profiles,
     * but author profile load after his mention, so the htmlfy must run when all
     * data is loaded
     */
    Object.defineProperty(tweet, "htmlSmallView", {
      get: () => {
        if (!tweet.htmlSmallViewLoaded) {
          tweet.htmlSmallViewLoaded = this.htmlfyService.safify(this.getSmallView(content));
        }

        return tweet.htmlSmallViewLoaded;
      },
    });

    Object.defineProperty(tweet, "htmlFullView", {
      get: () => {
        if (!tweet.htmlFullViewLoaded) {
          tweet.htmlFullViewLoaded = this.htmlfyService.safify(content);
        }

        return tweet.htmlFullViewLoaded;
      },
    });

    return tweet;
  }

  private castEventToTweet(event: NostrEvent, retweeting: string): {
    retweeted: Tweet, tweet: Retweet, npubs: Array<NPub>
  };
  private castEventToTweet(event: NostrEvent): {
    retweeted?: Tweet, tweet: Tweet, npubs: Array<NPub>
  };
  private castEventToTweet(event: NostrEvent, retweeting?: string): {
    retweeted?: Tweet, tweet: Tweet | Retweet, npubs: Array<NPub>
  } {
    const author = this.getAuthorNostrPublicFromEvent(event);
    let npubs: NPub[] = [author];
    let retweeted: Tweet | undefined = undefined;
    const tweet = this.instanceTweet(event, author);
    
    if (retweeting) {
      tweet.retweeting = retweeting;
      retweeted = TweetCache.get(retweeting);
    } else {
      retweeting = this.tweetTagsConverter.getMentionedEvent(event) || undefined;
      if (retweeting) {
        tweet.retweeting = retweeting;
      }
    }

    npubs = npubs.concat(this.tweetTagsConverter.geNPubFromTags(event));
    this.tweetTagsConverter.mergeCoordinatesFromEvent(tweet, event);
    this.tweetTagsConverter.mergeRetweetingFromEvent(tweet, event);

    return { retweeted, tweet, npubs };
  }

  private getTweetContent(event: NostrEvent): string {
    return event.content || '';
  }

  private getTweetCreated(event: NostrEvent): number {
    return event.created_at || 0;
  }

  extractEventsFromTweets(tweets: Tweet[]): string[] {
    return tweets.map(tweet => {
      const replies = tweet.replies || [];
      const repling = tweet.repling ? [tweet.repling] : [];
      const retweetedBy = tweet.retweetedBy || [];
      const retweeting = tweet.retweeting ? [tweet.retweeting] : [];

      return [...replies, ...repling, ...Object.keys(retweetedBy), ...retweeting];
    }).flat(1);
  }

  getRetweet(tweet: Retweet): Tweet;
  getRetweet(tweet?: Tweet | Retweet): Tweet | null;
  getRetweet(tweet?: Tweet | Retweet): Tweet | null {
    if (!tweet || !tweet.retweeting) {
      return null;
    }

    return TweetCache.get(tweet.retweeting) || null;
  }
}
