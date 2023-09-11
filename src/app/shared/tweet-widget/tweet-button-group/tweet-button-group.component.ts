import { Component, Input } from '@angular/core';
import { ITweet } from '@domain/tweet.interface';

@Component({
  selector: 'tw-tweet-button-group',
  templateUrl: './tweet-button-group.component.html',
  styleUrls: ['./tweet-button-group.component.scss']
})
export class TweetButtonGroupComponent {
  @Input()
  tweet: ITweet | null = null;
}