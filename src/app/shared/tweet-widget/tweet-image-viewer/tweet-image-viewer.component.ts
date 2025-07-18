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
  activeImage = '';

  @Output()
  closeEvent = new EventEmitter<void>();

  feed: FeedViewModel | null = null;

  showTweets = true;

  private getImageList(): string[] {
    // FIXME: return this.root?.viewModel.media?.imageList || [];
    return [];
  }

  private getIndexFromImageList(activeImage: string): number {
    return this.getImageList().indexOf(activeImage);
  }

  hasPreviousImage(): boolean {
    const indexOf = this.getIndexFromImageList(this.activeImage);
    return ![0, 0 - 1].includes(indexOf);
  }

  hasNextImage(): boolean {
    const indexOf = this.getIndexFromImageList(this.activeImage);
    const lastItem = this.getImageList().length || 0;
    return ![lastItem, lastItem - 1, 0 - 1].includes(indexOf);
  }

  showPreviousImage(): void {
    const currentIndexOf = this.getIndexFromImageList(this.activeImage);
    const imgList = this.getImageList();
    this.activeImage = imgList[currentIndexOf - 1] || this.activeImage || '';
  }

  showNextImage(): void {
    const currentIndexOf = this.getIndexFromImageList(this.activeImage);
    const imgList = this.getImageList();
    this.activeImage = imgList[currentIndexOf + 1] || this.activeImage || '';
  }

  @HostListener('document:keydown.escape')
  close(): void {
    this.closeEvent.next();
  }
}
