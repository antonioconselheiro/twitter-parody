import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NoteViewModel } from '@view-model/note.view-model';
import { RelatedContentViewModel } from '@view-model/related-content.view-model';
import { TweetImageViewing } from '../tweet-img-viewing.interface';
import { NoteContentViewModel } from '@view-model/context/note-content.view-model';

@Component({
  selector: 'tw-tweet-content',
  templateUrl: './tweet-content.component.html',
  styleUrls: ['./tweet-content.component.scss']
})
export class TweetContentComponent {

  @Input()
  isFull = false;

  @Input()
  tweet: RelatedContentViewModel<NoteViewModel> | null = null;

  @Output()
  imgOpen = new EventEmitter<TweetImageViewing | null>();

  getMimeType(url: string): string {
    if (/\.mp4$/.test(url)) {
      return 'video/mp4';
    } else if (/\.webm$/.test(url)) {
      return 'video/webm';
    } else if (/\.og[gv]$/.test(url)) {
      return 'video/ogg';
    }

    return '';
  }

  displayShowMoreButton(): boolean {
    //  FIXME: revisar implementação de como será decidido quando este botão será exibido
    return true;
  }

  getImages(tweet: RelatedContentViewModel<NoteViewModel> | null): [string, string?][] {
    const images: [string, string?][] = [];
    let currentImage!: [string, string?];

    const content = tweet?.viewModel.media
      .filter(media => media.type === 'image')
      .map(media => media.value) || [];

    content
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
    if (tweet) {
      const content = tweet.viewModel.media
        .filter(media => media.type === 'video')
        .map(media => media.value) || [];
      return content[0] || '';
    }

    return '';
  }

  shouldShowSegment(index: number, maxLength: number): boolean {
    if (this.isFull) {
      return true;
    } else {
      return index < maxLength;
    }
  }

  defineSummaryLength(content: NoteContentViewModel): number {
    let summaryLength = 0;
    while (['video', 'image'].includes(content[summaryLength].type)) {
      summaryLength++;
    }

    while (!['video', 'image'].includes(content[summaryLength].type)) {
      summaryLength++;
    }

    return summaryLength;
  }

}
