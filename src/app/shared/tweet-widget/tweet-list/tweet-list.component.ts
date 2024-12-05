import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { PopoverComponent } from '@shared/popover-widget/popover.component';
import { FeedAggregator } from '@view-model/feed-aggregator.interface';
import { RepostNoteViewModel } from '@view-model/repost-note.view-model';
import { SimpleTextNoteViewModel } from '@view-model/simple-text-note.view-model';
import { TweetImageViewing } from '../tweet-img-viewing.interface';

@Component({
  selector: 'tw-tweet-list',
  templateUrl: './tweet-list.component.html',
  styleUrls: ['./tweet-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TweetListComponent {

  @Input()
  loading = true;

  @Input()
  feed: FeedAggregator | null = null;

  @ViewChild('tweetActions', { read: PopoverComponent })
  share!: PopoverComponent;

  viewing: TweetImageViewing | null = null;

  trackByTweetId(i: number, tweet: SimpleTextNoteViewModel | RepostNoteViewModel): string {
    return tweet.id;
  }

  onImgOpen(viewing: TweetImageViewing | null): void {
    this.viewing = viewing;
  }
}
