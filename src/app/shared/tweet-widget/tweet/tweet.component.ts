import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DataLoadType } from '@domain/data-load.type';
import { IRetweet } from '@domain/retweet.interface';
import { ITweet } from '@domain/tweet.interface';
import { TweetTypeGuard } from '@shared/tweet-service/tweet.type-guard';
import { ITweetImgViewing } from '../tweet-img-viewing.interface';

@Component({
  selector: 'tw-tweet',
  templateUrl: './tweet.component.html',
  styleUrls: ['./tweet.component.scss']
})
export class TweetComponent {

  readonly EAGER_LOADED = DataLoadType.EAGER_LOADED;
  readonly LAZY_LOADED = DataLoadType.LAZY_LOADED;

  @Input()
  showImages = true;

  @Input()
  isFull = false;

  @Output()
  imgOpen = new EventEmitter<ITweetImgViewing | null>();

  imgList: string[] = [];
  imgs: [string, string?][] = [];

  interceptedTweet: ITweet | IRetweet | null = null;

  constructor(
    private tweetTypeGuard: TweetTypeGuard
  ) {}
  
  @Input()
  set tweet(tweet: ITweet | IRetweet | null) {
    this.interceptedTweet = tweet;
    this.showingTweet = this.tweetTypeGuard.getShowingTweet(this.tweet);
  }
  
  get tweet(): ITweet | IRetweet | null {
    return this.interceptedTweet;
  }

  showingTweet: ITweet | null = null;

  showMoreTextButton(): boolean {
    if (this.interceptedTweet && this.interceptedTweet.load === DataLoadType.EAGER_LOADED) {
      const smallViewLength = String(this.interceptedTweet.htmlSmallView).length
      const fullViewLength = String(this.interceptedTweet.htmlFullView).length;

      return smallViewLength !== fullViewLength;
    }

    return false;
  }
}
