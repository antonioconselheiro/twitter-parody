import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { DataLoadType } from '@domain/data-load.type';
import { IProfile } from '@domain/profile.interface';
import { ITweet } from '@domain/tweet.interface';
import { PopoverComponent } from '@shared/popover-widget/popover.component';
import { ProfileProxy } from '@shared/profile-service/profile.proxy';
import { TweetProxy } from '@shared/tweet-service/tweet.proxy';
import { ITweetImgViewing } from '../tweet-img-viewing.interface';
import { ProfileCache } from '@shared/profile-service/profile.cache';
import { TweetCache } from '@shared/tweet-service/tweet.cache';
import { IRetweet } from '@domain/retweet.interface';

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
  tweets: ITweet<DataLoadType.EAGER_LOADED>[] = [];

  @Input()
  set tweet(tweet: ITweet<DataLoadType.EAGER_LOADED> | null) {
    this.interceptedTweet = tweet;
    this.interceptTweet(tweet);
  }

  get tweet(): ITweet<DataLoadType.EAGER_LOADED> | null {
    return this.interceptedTweet;
  }

  private interceptedTweet: ITweet<DataLoadType.EAGER_LOADED> | null = null;

  @ViewChild('tweetActions', { read: PopoverComponent })
  share!: PopoverComponent;

  viewing: ITweetImgViewing | null = null;

  constructor(
    private profileProxy: ProfileProxy,
    private tweetProxy: TweetProxy
  ) { }

  isSimpleRetweet(tweet: ITweet<DataLoadType.EAGER_LOADED>): tweet is IRetweet {
    return tweet.retweeting && !String(tweet.htmlFullView).trim().length || false;
  }

  getRetweetAuthorName(tweet: ITweet<DataLoadType.EAGER_LOADED>): string {
    const author = ProfileCache.profiles[tweet.author];
    return author.display_name || author.name || '';
  }

  getAuthorProfile(tweet: ITweet<DataLoadType.EAGER_LOADED>): IProfile {
    //  FIXME: dar um jeito do template não precisar chamar
    //  diversas vezes um método com essa complexidade
    if (this.isSimpleRetweet(tweet)) {
      return ProfileCache.profiles[TweetCache.eagerTweets[tweet.retweeting].author];
    }

    return ProfileCache.profiles[tweet.author];
  }

  getAuthorName(tweet: ITweet<DataLoadType.EAGER_LOADED>): string {
    const author = this.getAuthorProfile(tweet);
    return author.display_name || author.name || '';
  }

  private interceptTweet(tweet: ITweet<DataLoadType.EAGER_LOADED> | null): void {
    if (tweet && tweet.load === DataLoadType.EAGER_LOADED) {
      const repliesId = (tweet.replies || []);
      const replies = repliesId.map(reply => this.tweetProxy.get(reply))
      this.tweets = [tweet].concat(replies)
    }
  }

  trackByTweetId(i: number, tweet: ITweet<DataLoadType.EAGER_LOADED>): string {
    return tweet.id;
  }

  onImgOpen(viewing: ITweetImgViewing | null): void {
    this.viewing = viewing;
  }
}
