import { Injectable } from '@angular/core';
import { NoteContentViewModel } from '@view-model/context/note-content.view-model';
import { NoteViewModel } from '@view-model/note.view-model';
import { RelatedContentViewModel } from '@view-model/related-content.view-model';
import { SummarizedTweetContentViewModel } from './summarized-tweet-content.view-model';

@Injectable({
  providedIn: 'root'
})
export class TweetContentService {

  summarizeTweet(note: RelatedContentViewModel<NoteViewModel>): SummarizedTweetContentViewModel {
    const { showSummarized, summarized } = this.summarizedContent(note);

    return {
      showSummarized,
      videoUrl: this.getVideoUrl(note),
      images: this.getImages(note),
      summarized,
      note
    };
  }

  // eslint-disable-next-line complexity
  private summarizedContent(note: RelatedContentViewModel<NoteViewModel>): {
    showSummarized: boolean,
    summarized: NoteContentViewModel
  } {
    const content = note.viewModel.content || [],
      summarizedContent: NoteContentViewModel = [],
      maxLength = 250,
      maxVideo = 1,
      maxImages = 4;
    let summaryAmount = 0, videoAmount = 0, imageAmount = 0, showSummarized = false;

    for (let index = 0; index < content.length; index++) {
      const segment = content[index];
      if (segment.type === 'image') {
        imageAmount++;
      } else if (segment.type === 'video') {
        videoAmount++;
      } else {
        if (summaryAmount >= maxLength) {
          continue;
        }

        summaryAmount += segment.value.length;
        if (summaryAmount >= maxLength) {
          const difference = summaryAmount - maxLength;
          const summarizedText = segment.value.substring(0, difference);
          summarizedContent.push({
            type: 'summarized',
            value: `${summarizedText}…`,
            original: segment
          });
        } else {
          summarizedContent.push(segment);
        }
      }
    }

    if (
      summaryAmount < maxLength ||
      videoAmount > maxVideo ||
      imageAmount > maxImages
    ) {
      showSummarized = true;
    }

    return {
      showSummarized,
      summarized: summarizedContent
    };
  }

  private getVideoUrl(tweet: RelatedContentViewModel<NoteViewModel> | null): string | null {
    return tweet?.viewModel.media
      .filter(media => media.type === 'video')
      .map(media => media.value)
      .shift() || null;
  }

  private getImages(tweet: RelatedContentViewModel<NoteViewModel> | null): [string, string?][] {
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
}
