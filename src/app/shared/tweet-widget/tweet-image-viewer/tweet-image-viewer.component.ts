import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { Tweet } from '@domain/tweet.interface';

@Component({
  selector: 'tw-tweet-image-viewer',
  templateUrl: './tweet-image-viewer.component.html',
  styleUrls: ['./tweet-image-viewer.component.scss']
})
export class TweetImageViewerComponent {

  @Input()
  tweet: Tweet | null = null;

  @Input()
  activeImage = '';

  @Output()
  closeEvent = new EventEmitter<void>();

  showTweets = true;

  private getImageList(): string[] {
    return this.tweet?.imageList || [];
  }

  private getIndexFromImageList(activeImage: string): number {
    return this.getImageList().indexOf(activeImage);
  }

  hasPreviousImage(): boolean {
    const indexOf = this.getIndexFromImageList(this.activeImage);
    return ![0, 0-1].includes(indexOf);
  }

  hasNextImage(): boolean {
    const indexOf = this.getIndexFromImageList(this.activeImage);
    const lastItem = this.getImageList().length || 0;
    return ![lastItem, lastItem-1, 0-1].includes(indexOf);
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
