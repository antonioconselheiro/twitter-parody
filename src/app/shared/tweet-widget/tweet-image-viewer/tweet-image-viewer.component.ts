import { Component, Input } from '@angular/core';
import { ITweet } from '@domain/tweet.interface';

@Component({
  selector: 'tw-tweet-image-viewer',
  templateUrl: './tweet-image-viewer.component.html',
  styleUrls: ['./tweet-image-viewer.component.scss']
})
export class TweetImageViewerComponent {

  @Input()
  tweet: ITweet | null = null;

  @Input()
  activeImage = '';
}
