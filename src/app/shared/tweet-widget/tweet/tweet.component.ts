import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Retweet } from '../../deprecated-domain/retweet.interface';
import { Tweet } from '../../deprecated-domain/tweet.interface';
import { TweetTypeGuard } from '@shared/tweet-service/tweet.type-guard';
import { ITweetImgViewing } from '../tweet-img-viewing.interface';

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

  interceptedTweet: Tweet | Retweet | null = null;

  constructor(
    private tweetTypeGuard: TweetTypeGuard
  ) {}
  
  @Input()
  set tweet(tweet: Tweet | Retweet | null) {
    this.interceptedTweet = tweet;
    this.showingTweet = this.tweetTypeGuard.getShowingTweet(this.tweet);
  }
  
  get tweet(): Tweet | Retweet | null {
    return this.interceptedTweet;
  }

  showingTweet: Tweet | null = null;

  showMoreTextButton(): boolean {
    const smallViewLength = String(this.interceptedTweet?.htmlSmallView || '').length
    const fullViewLength = String(this.interceptedTweet?.htmlFullView || '').length;

    return smallViewLength !== fullViewLength;

    return false;
  }
}
