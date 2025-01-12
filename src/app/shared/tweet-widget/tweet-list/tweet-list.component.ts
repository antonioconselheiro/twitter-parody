import { Component, Input } from '@angular/core';
import { TweetContextMenuHandler } from '@shared/tweet-service/tweet-popover.handler';
import { FeedViewModel } from '@view-model/feed.view-model';
import { NoteViewModel } from '@view-model/note.view-model';
import { TweetImageViewing } from '../tweet-img-viewing.interface';
import { AccountRenderable } from '@belomonte/nostr-ngx';

@Component({
  selector: 'tw-tweet-list',
  templateUrl: './tweet-list.component.html',
  styleUrls: ['./tweet-list.component.scss']
})
export class TweetListComponent {

  @Input()
  root: NoteViewModel<AccountRenderable> | null = null;

  @Input()
  feed: FeedViewModel<AccountRenderable> | null = null;

  @Input()
  loading = true;

  viewing: TweetImageViewing | null = null;

  constructor(
    private tweetPopoverHandler: TweetContextMenuHandler
  ) { }

  openTweetContextMenu(note: NoteViewModel<AccountRenderable>, trigger: HTMLElement): void {
    this.tweetPopoverHandler.handleContextMenu({ note, trigger });
  }

  trackByTweetId(i: number, tweet: NoteViewModel<AccountRenderable>): string {
    return tweet.id;
  }

  onImgOpen(viewing: TweetImageViewing | null): void {
    this.viewing = viewing;
  }
}
