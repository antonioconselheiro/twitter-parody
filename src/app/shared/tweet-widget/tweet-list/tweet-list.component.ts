import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { Retweet } from 'src/app/deprecated-domain/retweet.interface';
import { Tweet } from 'src/app/deprecated-domain/tweet.interface';
import { PopoverComponent } from '@shared/popover-widget/popover.component';
import { TweetProxy } from '@shared/tweet-service/tweet.proxy';
import { TweetTypeGuard } from '@shared/tweet-service/tweet.type-guard';
import { ITweetImgViewing } from '../tweet-img-viewing.interface';
import { TweetConverter } from '@shared/tweet-service/tweet.converter';
import { NostrMetadata } from '@nostrify/nostrify';
import { Account, NostrPool, ProfileService } from '@belomonte/nostr-ngx';

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
  tweets: Array<Tweet | Retweet> = [];

  /**
   * This represents the root tweet of a thread of chained
   * tweets, if this property is set the replies must be
   * shown in this tweet list
   */
  @Input()
  set tweet(tweet: Tweet | Retweet | null) {
    this.interceptedTweet = tweet;
    this.interceptTweet(tweet);
  }

  get tweet(): Tweet | Retweet | null {
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
  private interceptedTweet: Tweet | Retweet | null = null;

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

  async getRetweetAuthorName(tweet: Tweet): Promise<string> {
    const account = await this.profileService.loadAccount(tweet.author);
    const author = account && account.metadata;
    return author && (author.display_name || author.name) || '';
  }

  getAuthorProfile(tweet: Tweet): Account | null {
    //  FIXME: dar um jeito do template não precisar chamar
    //  diversas vezes um método com essa complexidade
    return this.tweetProxy.getTweetOrRetweetedAuthorProfile(tweet);
  }

  isSimpleRetweet(tweet: Tweet): tweet is Retweet {
    return this.tweetTypeGuard.isSimpleRetweet(tweet);
  }

  showMentionedTweetInRetweet(tweet: Tweet | Retweet): boolean {
    const has = this.tweetConverter.getRetweet(tweet);
    if (!has) {
      return false;
    }

    if (this.retweeted) {
      return false;
    }

    return true;
  }

  getRetweet(tweet: Tweet | Retweet): Tweet | null {
    return this.tweetConverter.getRetweet(tweet);
  }

  getAuthorName(tweet: Tweet): string {
    const author = this.getAuthorProfile(tweet);
    if (!author) {
      return '';
    }

    return author.display_name || author.name || '';
  }

  private async interceptTweet(tweet: Tweet | Retweet | null): Promise<void> {
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
