import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { DataLoadType } from '@domain/data-load.type';
import { IProfile } from '@domain/profile.interface';
import { IRetweet } from '@domain/retweet.interface';
import { ITweet } from '@domain/tweet.interface';
import { PopoverComponent } from '@shared/popover-widget/popover.component';
import { ProfileCache } from '@shared/profile-service/profile.cache';
import { TweetConverter } from '@shared/tweet-service/tweet.converter';
import { TweetProxy } from '@shared/tweet-service/tweet.proxy';
import { ITweetImgViewing } from '../tweet-img-viewing.interface';

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

  @Input()
  set tweet(tweet: ITweet | IRetweet | null) {
    this.interceptedTweet = tweet;
    this.interceptTweet(tweet);
  }

  get tweet(): ITweet | IRetweet | null {
    return this.interceptedTweet;
  }

  private interceptedTweet: ITweet | IRetweet | null = null;

  @ViewChild('tweetActions', { read: PopoverComponent })
  share!: PopoverComponent;

  viewing: ITweetImgViewing | null = null;

  constructor(
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
    return this.tweetConverter.isSimpleRetweet(tweet);
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

  trackByTweetId(i: number, tweet: ITweet): string {
    return tweet.id;
  }

  onImgOpen(viewing: ITweetImgViewing | null): void {
    this.viewing = viewing;
  }
}
