import { Component, Input } from '@angular/core';
import { UrlUtil } from '@shared/util/url.service';
import { TweetHtmlfyService } from '../tweet-htmlfy/tweet-htmlfy.service';

@Component({
  selector: 'tw-tweet',
  templateUrl: './tweet.component.html',
  styleUrls: ['./tweet.component.scss']
})
export class TweetComponent {

  @Input()
  isFull = false;
  
  @Input()
  set tweet(tweet: string) {
    this.tweetText = tweet;
    this.onTweetUpdate(tweet);
  }

  get tweet(): string  {
    return this.tweetText;
  }

  private tweetText = '';
  imgs: string[] = [];
  smallView = '';
  fullView = '';

  constructor(
    private urlUtil: UrlUtil,
    private tweetHtmlfyService: TweetHtmlfyService
  ) {}

  showMoreTextButton(): boolean {
    return this.smallView.length !== this.fullView.length;
  }

  private onTweetUpdate(tweet: string): void {
    const { imgs } = this.tweetHtmlfyService.separateImageAndLinks(tweet);

    this.imgs = imgs;
    this.smallView = this.getSmallView(tweet, this.imgs);
    this.fullView = this.getFullView(tweet, this.imgs);
  }

  private getSmallView(tweet: string, imgs: string[]): string {
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

  private getFullView(tweet: string, imgs: string[]): string {
    imgs.forEach(img => tweet = tweet.replace(this.urlUtil.regexFromLink(img), ''))
    return tweet;
  }

}
