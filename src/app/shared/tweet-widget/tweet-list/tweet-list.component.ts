 import { Component, Input, ViewEncapsulation } from '@angular/core';
import { ITweet } from '@domain/tweet.interface';
import { ITweetImgViewing } from '../tweet-img-viewing.interface';

@Component({
  selector: 'tw-tweet-list',
  templateUrl: './tweet-list.component.html',
  styleUrls: ['./tweet-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TweetListComponent {

  @Input()
  tweets: ITweet[] = [];

  viewing: ITweetImgViewing | null = null;

  trackByTweetId(i: number, tweet: ITweet): string {
    return tweet.id;
  }

  onImgOpen(viewing: ITweetImgViewing | null): void {
    this.viewing = viewing;
  }
}
