import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NoteViewModel } from '@view-model/note.view-model';
import { RelatedContentViewModel } from '@view-model/related-content.view-model';
import { TweetImageViewing } from '../tweet-img-viewing.interface';

@Component({
  selector: 'tw-tweet',
  templateUrl: './tweet.component.html',
  styleUrls: ['./tweet.component.scss']
})
export class TweetComponent {

  @Input()
  showImages = true;

  @Input()
  isFull = false;

  @Input()
  tweet: RelatedContentViewModel<NoteViewModel> | null = null;

  @Output()
  imgOpen = new EventEmitter<TweetImageViewing | null>();

  showMoreTextButton(): boolean {
    const content = this.tweet?.viewModel.content;

    if (content) {
      const smallViewLength = String(content.smallView || '').length
      const fullViewLength = String(content.fullView || '').length;

      return smallViewLength !== fullViewLength;
    }

    return false;
  }

  getImages(): [string, string?][] {
    const images: [string, string?][] = [];
    let currentImage!: [string, string?];

    new Array<string>()
      .concat(this.tweet?.viewModel.media?.imageList || [])
      .forEach((image, index) => {
        const pair = 2;
        if (index % pair === 0) {
          currentImage = [image];
          images.push(currentImage);
        } else {
          currentImage.push(image);
        }
      });

    return images;
  }

  getVideoUrl(tweet: RelatedContentViewModel<NoteViewModel> | null): string {
    return tweet &&
      'media' in tweet.viewModel &&
      tweet.viewModel.media &&
      tweet.viewModel.media.videoList[0] || '';
  }
}
