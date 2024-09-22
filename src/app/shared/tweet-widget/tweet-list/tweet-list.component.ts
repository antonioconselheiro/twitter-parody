import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { DataLoadType } from '@domain/data-load.type';
import { IRetweet } from '@domain/retweet.interface';
import { ITweet } from '@domain/tweet.interface';
import { PopoverComponent } from '@shared/popover-widget/popover.component';
import { TweetProxy } from '@shared/tweet-service/tweet.proxy';
import { TweetTypeGuard } from '@shared/tweet-service/tweet.type-guard';
import { ITweetImgViewing } from '../tweet-img-viewing.interface';
import { TweetConverter } from '@shared/tweet-service/tweet.converter';
import { IProfile, ProfileCache } from '@belomonte/nostr-gui-ngx';

@Component({
  selector: 'tw-tweet-list',
  templateUrl: './tweet-list.component.html',
  styleUrls: ['./tweet-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TweetListComponent {

  readonly EAGER_LOADED = DataLoadType.EAGER_LOADED;
  readonly LAZY_LOADED = DataLoadType.LAZY_LOADED;

  @Input()
  loading = true;

  @Input()
  tweets: Array<ITweet | IRetweet> = [];

  /**
   * This represents the root tweet of a thread of chained
   * tweets, if this property is set the replies must be
   * shown in this tweet list
   */
  @Input()
  set tweet(tweet: ITweet | IRetweet | null) {
    this.interceptedTweet = tweet;
    this.interceptTweet(tweet);
  }

  get tweet(): ITweet | IRetweet | null {
    return this.interceptedTweet;
  }

  /**
   * In a retweet with comment, the tw-tweet-list do a recursive
   * instance to show the retweeted content, but reduced, with
   * no buttons and if it is a retweet with comment, only the
   * comment is shown
   */
  @Input()
  set retweeted(tweet: ITweet | null) {
    this.interceptedRetweet = tweet;
    this.interceptRetweet(tweet);
  }

  get retweeted(): ITweet | null {
    return this.interceptedRetweet;
  }

  private interceptedRetweet: ITweet | null = null;
  private interceptedTweet: ITweet | IRetweet | null = null;

  @ViewChild('tweetActions', { read: PopoverComponent })
  share!: PopoverComponent;

  viewing: ITweetImgViewing | null = null;

  constructor(
    private tweetTypeGuard: TweetTypeGuard,
    private tweetConverter: TweetConverter,
    private tweetProxy: TweetProxy
  ) { }

  getRetweetAuthorName(tweet: ITweet<DataLoadType.EAGER_LOADED>): string {
    const author = ProfileCache.profiles[tweet.author];
    return author.display_name || author.name || '';
  }

  getAuthorProfile(tweet: ITweet): IProfile | null {
    //  FIXME: dar um jeito do template não precisar chamar
    //  diversas vezes um método com essa complexidade
    return this.tweetProxy.getTweetOrRetweetedAuthorProfile(tweet);
  }

  isSimpleRetweet(tweet: ITweet<DataLoadType.EAGER_LOADED>): tweet is IRetweet {
    return this.tweetTypeGuard.isSimpleRetweet(tweet);
  }

  showMentionedTweetInRetweet(tweet: ITweet | IRetweet): boolean {
    const has = this.tweetConverter.getRetweet(tweet);
    if (!has) {
      return false;
    }

    if (this.retweeted) {
      return false;
    }

    return true;
  }

  getRetweet(tweet: ITweet | IRetweet): ITweet | null {
    return this.tweetConverter.getRetweet(tweet);
  }

  getAuthorName(tweet: ITweet): string {
    const author = this.getAuthorProfile(tweet);
    if (!author) {
      return '';
    }

    return author.display_name || author.name || '';
  }

  private interceptTweet(tweet: ITweet | IRetweet | null): void {
    if (tweet && tweet.load === DataLoadType.EAGER_LOADED) {
      const repliesId = (tweet.replies || []);
      const replies = repliesId.map(reply => this.tweetProxy.get(reply))
      this.tweets = [tweet, ...replies];
    }
  }

  private interceptRetweet(tweet: ITweet | null): void {
    if (tweet && tweet.load === DataLoadType.EAGER_LOADED) {
      this.tweets = [ tweet ];
    }
  }

  trackByTweetId(i: number, tweet: ITweet): string {
    return tweet.id;
  }

  onImgOpen(viewing: ITweetImgViewing | null): void {
    this.viewing = viewing;
  }
}
