import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { DataLoadType } from '@domain/data-load.type';
import { IProfile } from '@domain/profile.interface';
import { ITweet } from '@domain/tweet.interface';
import { PopoverComponent } from '@shared/popover-widget/popover.component';
import { ProfileProxy } from '@shared/profile-service/profile.proxy';
import { TweetProxy } from '@shared/tweet-service/tweet.proxy';
import { ITweetImgViewing } from '../tweet-img-viewing.interface';

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

  getAuthorProfile(npub: string): IProfile {
    return this.profileProxy.get(npub);
  }

  getAuthorName(npub?: string): string {
    if (!npub) {
      return '';
    }

    const author = this.profileProxy.get(npub);
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
