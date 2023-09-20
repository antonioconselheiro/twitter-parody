import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UrlUtil } from '@shared/util/url.service';
import { TweetHtmlfyService } from '../tweet-htmlfy/tweet-htmlfy.service';
import { ITweetImgViewing } from '../tweet-img-viewing.interface';
import { ITweet } from '@domain/tweet.interface';

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
  
  @Input()
  set tweet(tweet: ITweet | null) {
    this.interceptedTweet = tweet;
    this.onTweetUpdate(tweet);
  }

  get tweet(): ITweet | null {
    return this.interceptedTweet;
  }

  @Output()
  imgOpen = new EventEmitter<ITweetImgViewing | null>();

  private interceptedTweet: ITweet | null = null;

  imgs: [string, string?][] = [];
  smallView = '';
  fullView = '';

  constructor(
    private urlUtil: UrlUtil,
    private tweetHtmlfyService: TweetHtmlfyService
  ) {}

  showMoreTextButton(): boolean {
    return this.smallView.length !== this.fullView.length;
  }

  private onTweetUpdate(tweet: ITweet | null): void {
    if (!tweet || !tweet.content) {
      return;
    }

    const { imgs } = this.tweetHtmlfyService.separateImageAndLinks(tweet.content);

    this.imgs = imgs;
    this.smallView = this.getSmallView(tweet.content, this.imgs);
    this.fullView = this.getFullView(tweet.content, this.imgs);
  }

  private getSmallView(tweet: string, imgs: [string, string?][]): string {
    const maxLength = 280;
    let content = this.getFullView(tweet, imgs);
    if (content.length > maxLength) {
      content = content.substring(0, maxLength - 1);
      //  substituí eventual link cortado pela metade
      content = content.replace(/http[^ ]+$/, '');
      content += '…';
    }

    return content;
  }

  private getFullView(tweet: string, imgs: [string, string?][]): string {
    const imgList = new Array<string | undefined>()
      .concat(...imgs)
      .filter((i): i is string => !!i);

    imgList.forEach(img => tweet = tweet.replace(this.urlUtil.regexFromLink(img), ''))
    return tweet;
  }

}
