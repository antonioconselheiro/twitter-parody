import { Component, Input } from '@angular/core';
import { TweetContextMenuHandler } from '@shared/tweet-service/tweet-popover.handler';
import { FeedViewModel } from '@view-model/feed.view-model';
import { NoteViewModel } from '@view-model/note.view-model';
import { RelatedContentViewModel } from '@view-model/related-content.view-model';
import { TweetImageViewing } from '../tweet-img-viewing.interface';

@Component({
  selector: 'tw-tweet-list',
  templateUrl: './tweet-list.component.html',
  styleUrls: ['./tweet-list.component.scss']
})
export class TweetListComponent {

  @Input()
  root: RelatedContentViewModel<NoteViewModel> | null = null;

  @Input()
  feed: FeedViewModel | null = null;

  @Input()
  loading = true;

  viewing: TweetImageViewing | null = null;

  constructor(
    private tweetPopoverHandler: TweetContextMenuHandler
  ) { }

  openTweetContextMenu(tweet: RelatedContentViewModel<NoteViewModel>, trigger: HTMLElement): void {
    this.tweetPopoverHandler.handleContextMenu({ note: tweet, trigger });
  }

  trackByTweetId(i: number, related: RelatedContentViewModel<NoteViewModel>): string {
    return related.viewModel.id;
  }

  onImgOpen(viewing: TweetImageViewing | null): void {
    this.viewing = viewing;
  }
}
