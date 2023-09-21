import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ITweet } from '@domain/tweet.interface';
import { ITweetImgViewing } from '../tweet-img-viewing.interface';
import { DataLoadType } from '@domain/data-load.type';

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

  @Input()
  tweet: ITweet<DataLoadType.EAGER_LOADED> | null = null;

  showMoreTextButton(): boolean {
    return this.smallView.length !== this.fullView.length;
  }
}
