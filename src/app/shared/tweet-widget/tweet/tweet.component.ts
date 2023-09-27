import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ITweet } from '@domain/tweet.interface';
import { ITweetImgViewing } from '../tweet-img-viewing.interface';
import { DataLoadType } from '@domain/data-load.type';
import { TweetCache } from '@shared/tweet-service/tweet.cache';

@Component({
  selector: 'tw-tweet',
  templateUrl: './tweet.component.html',
  styleUrls: ['./tweet.component.scss']
})
export class TweetComponent {

  @Input()
  showImages = true;

  @Input()
  isFull = false;

  @Output()
  imgOpen = new EventEmitter<ITweetImgViewing | null>();

  imgList: string[] = [];
  imgs: [string, string?][] = [];

  smallView = '';
  fullView = '';

  interceptedTweet: ITweet<DataLoadType.EAGER_LOADED> | null = null;
  
  @Input()
  set tweet(tweet: ITweet<DataLoadType.EAGER_LOADED> | null) {
    this.interceptedTweet = tweet;
    this.showingTweet = this.getShowingTweet();
  }
  
  get tweet(): ITweet<DataLoadType.EAGER_LOADED> | null {
    return this.interceptedTweet;
  }

  showingTweet: ITweet<DataLoadType.EAGER_LOADED> | null = null;

  showMoreTextButton(): boolean {
    return this.smallView.length !== this.fullView.length;
  }

  getShowingTweet(): ITweet<DataLoadType.EAGER_LOADED> | null {
    if (!this.tweet) {
      return null;
    } else if (this.tweet.retweeting) {
      return TweetCache.get(this.tweet.retweeting);
    } else {
      return this.tweet;
    }
  }
}
