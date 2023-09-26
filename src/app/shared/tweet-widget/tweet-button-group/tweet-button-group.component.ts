import { Component, Input, ViewChild } from '@angular/core';
import { DataLoadType } from '@domain/data-load.type';
import { ITweet } from '@domain/tweet.interface';
import { PopoverComponent } from '@shared/popover-widget/popover.component';
import { TweetConverter } from '@shared/tweet-service/tweet.converter';

@Component({
  selector: 'tw-tweet-button-group',
  templateUrl: './tweet-button-group.component.html',
  styleUrls: ['./tweet-button-group.component.scss']
})
export class TweetButtonGroupComponent {
  @Input()
  tweet: ITweet<DataLoadType.EAGER_LOADED> | null = null;

  @ViewChild('tweetShare', { read: PopoverComponent })
  share!: PopoverComponent;

  constructor(
    private tweetConverter: TweetConverter
  ) { }

  getTweetReactions(tweet?: ITweet | null): number {
    return this.tweetConverter.getTweetReactions(tweet);
  }
}
