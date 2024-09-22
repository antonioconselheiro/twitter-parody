import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { IRetweet } from '@domain/retweet.interface';
import { Tweet } from '@domain/tweet.interface';
import { PopoverComponent } from '@shared/popover-widget/popover.component';
import { TweetProxy } from '@shared/tweet-service/tweet.proxy';
import { TweetTypeGuard } from '@shared/tweet-service/tweet.type-guard';
import { ITweetImgViewing } from '../tweet-img-viewing.interface';
import { TweetConverter } from '@shared/tweet-service/tweet.converter';
import { NostrMetadata } from '@nostrify/nostrify';
import { NostrPool, ProfileService } from '@belomonte/nostr-ngx';

@Component({
  selector: 'tw-tweet-list',
  templateUrl: './tweet-list.component.html',
  styleUrls: ['./tweet-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TweetListComponent {

  @Input()
  loading = true;

  @Input()
  tweets: Array<Tweet | IRetweet> = [];

  /**
   * This represents the root tweet of a thread of chained
   * tweets, if this property is set the replies must be
   * shown in this tweet list
   */
  @Input()
  set tweet(tweet: Tweet | IRetweet | null) {
    this.interceptedTweet = tweet;
    this.interceptTweet(tweet);
  }

  get tweet(): Tweet | IRetweet | null {
    return this.interceptedTweet;
  }

  /**
   * In a retweet with comment, the tw-tweet-list do a recursive
   * instance to show the retweeted content, but reduced, with
   * no buttons and if it is a retweet with comment, only the
   * comment is shown
   */
  @Input()
  set retweeted(tweet: Tweet | null) {
    this.interceptedRetweet = tweet;
    this.interceptRetweet(tweet);
  }

  get retweeted(): Tweet | null {
    return this.interceptedRetweet;
  }

  private interceptedRetweet: Tweet | null = null;
  private interceptedTweet: Tweet | IRetweet | null = null;

  @ViewChild('tweetActions', { read: PopoverComponent })
  share!: PopoverComponent;

  viewing: ITweetImgViewing | null = null;

  constructor(
    private tweetTypeGuard: TweetTypeGuard,
    private tweetConverter: TweetConverter,
    private tweetProxy: TweetProxy,
    private profileService: ProfileService,
    private npool: NostrPool
  ) { }

  async getRetweetAuthorName(tweet: Tweet): string {
    const author = await this.profileService.get(tweet.author);
    return author && (author.display_name || author.name) || '';
  }

  getAuthorProfile(tweet: Tweet): NostrMetadata | null {
    //  FIXME: dar um jeito do template não precisar chamar
    //  diversas vezes um método com essa complexidade
    return this.tweetProxy.getTweetOrRetweetedAuthorProfile(tweet);
  }

  isSimpleRetweet(tweet: Tweet): tweet is IRetweet {
    return this.tweetTypeGuard.isSimpleRetweet(tweet);
  }

  showMentionedTweetInRetweet(tweet: Tweet | IRetweet): boolean {
    const has = this.tweetConverter.getRetweet(tweet);
    if (!has) {
      return false;
    }

    if (this.retweeted) {
      return false;
    }

    return true;
  }

  getRetweet(tweet: Tweet | IRetweet): Tweet | null {
    return this.tweetConverter.getRetweet(tweet);
  }

  getAuthorName(tweet: Tweet): string {
    const author = this.getAuthorProfile(tweet);
    if (!author) {
      return '';
    }

    return author.display_name || author.name || '';
  }

  private async interceptTweet(tweet: Tweet | IRetweet | null): Promise<void> {
    if (tweet) {
      const repliesId = (tweet.replies || []);
      const repliesPromise = repliesId.map(reply => this.npool.query([{ ids: [ reply ], limit: 1 }]));
      const events = (await Promise.all(repliesPromise)).flat(2);
      const replies = this.tweetConverter.castResultsetToTweets(events);
      this.tweets = [tweet, ...replies];
    }
  }

  private interceptRetweet(tweet: Tweet | null): void {
    if (tweet) {
      this.tweets = [ tweet ];
    }
  }

  trackByTweetId(i: number, tweet: Tweet): string {
    return tweet.id;
  }

  onImgOpen(viewing: ITweetImgViewing | null): void {
    this.viewing = viewing;
  }
}
