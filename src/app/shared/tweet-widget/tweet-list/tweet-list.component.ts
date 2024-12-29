import { Component, Input } from '@angular/core';
import { TweetPopoverHandler } from '@shared/tweet-service/tweet-popover.handler';
import { FeedViewModel } from '@view-model/feed.view-model';
import { NoteViewModel } from '@view-model/note.view-model';
import { TweetImageViewing } from '../tweet-img-viewing.interface';

@Component({
  selector: 'tw-tweet-list',
  templateUrl: './tweet-list.component.html',
  styleUrls: ['./tweet-list.component.scss']
})
export class TweetListComponent {

  @Input()
  root: NoteViewModel | null = null;

  @Input()
  feed: FeedViewModel | null = null;

  @Input()
  loading = true;

  viewing: TweetImageViewing | null = null;

  constructor(
    private tweetPopoverHandler: TweetPopoverHandler
  ) { }

  openTweetPopover(note: NoteViewModel, trigger: HTMLElement): void {
    this.tweetPopoverHandler.handle({ note, trigger });
  }

  trackByTweetId(i: number, tweet: NoteViewModel): string {
    return tweet.id;
  }

  onImgOpen(viewing: TweetImageViewing | null): void {
    this.viewing = viewing;
  }
}
