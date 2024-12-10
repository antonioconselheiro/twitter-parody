import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { PopoverComponent } from '@shared/popover-widget/popover.component';
import { NoteViewModel } from '@view-model/note.view-model';
import { TweetImageViewing } from '../tweet-img-viewing.interface';
import { FeedViewModel } from '@view-model/feed.view-model';

@Component({
  selector: 'tw-tweet-list',
  templateUrl: './tweet-list.component.html',
  styleUrls: ['./tweet-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TweetListComponent {

  @Input()
  root: NoteViewModel | null = null;

  @Input()
  feed: FeedViewModel | null = null;

  @ViewChild('tweetActions', { read: PopoverComponent })
  share!: PopoverComponent;

  @Input()
  loading = true;

  viewing: TweetImageViewing | null = null;

  trackByTweetId(i: number, tweet: NoteViewModel): string {
    return tweet.id;
  }

  onImgOpen(viewing: TweetImageViewing | null): void {
    this.viewing = viewing;
  }
}
