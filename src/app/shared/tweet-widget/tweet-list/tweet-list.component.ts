import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { ITweet } from '@domain/tweet.interface';
import { ITweetImgViewing } from '../tweet-img-viewing.interface';
import { PopoverComponent } from '@shared/popover-widget/popover.component';

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
  tweets: ITweet[] = [];

  @Input()
  set tweet(tweet: ITweet | null) {
    this.interceptedTweet = tweet;
    this.interceptTweet(tweet);
  }

  get tweet(): ITweet | null {
    return this.interceptedTweet;
  }

  private interceptedTweet: ITweet | null = null;

  @ViewChild('tweetActions', { read: PopoverComponent })
  share!: PopoverComponent;

  viewing: ITweetImgViewing | null = null;

  private interceptTweet(tweet: ITweet | null): void {
    if (tweet) {
      this.tweets = [tweet].concat(tweet.replies || [])
    }
  }

  trackByTweetId(i: number, tweet: ITweet): string {
    return tweet.id;
  }

  onImgOpen(viewing: ITweetImgViewing | null): void {
    this.viewing = viewing;
  }
}
