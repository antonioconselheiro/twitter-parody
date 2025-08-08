import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { FeedViewModel } from '@view-model/feed.view-model';
import { NoteViewModel } from '@view-model/note.view-model';
import { RelatedContentViewModel } from '@view-model/related-content.view-model';

@Component({
  selector: 'tw-tweet-image-viewer',
  templateUrl: './tweet-image-viewer.component.html',
  styleUrls: ['./tweet-image-viewer.component.scss']
})
export class TweetImageViewerComponent {

  @Input()
  tweet: RelatedContentViewModel<NoteViewModel> | null = null;

  @Input()
  activeImage = 0;

  @Output()
  closeEvent = new EventEmitter<void>();

  feed: FeedViewModel | null = null;

  showTweets = true;

  private getImageList(): string[] {
    return this.tweet?.viewModel.media
      .filter(segment => segment.type === 'image')
      .map(segment => segment.value) || [];
  }

  hasPreviousImage(): boolean {
    return ![0, 0 - 1].includes(this.activeImage);
  }

  hasNextImage(): boolean {
    const lastItem = this.getImageList().length || 0;
    return ![lastItem, lastItem - 1, 0 - 1].includes(this.activeImage);
  }

  showPreviousImage(): void {
    this.activeImage = this.activeImage - 1;
  }

  showNextImage(): void {
    this.activeImage = this.activeImage + 1;
  }

  @HostListener('document:keydown.escape')
  close(): void {
    this.closeEvent.next();
  }
}
