import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NoteContentViewModel } from '@view-model/context/note-content.view-model';
import { NoteViewModel } from '@view-model/note.view-model';
import { RelatedContentViewModel } from '@view-model/related-content.view-model';
import { TweetImageViewing } from '../tweet-img-viewing.interface';
import { SummarizedTweetContentViewModel } from './summarized-tweet-content.view-model';
import { TweetContentService } from './tweet-content.service';

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

  constructor(
    private tweetContentService: TweetContentService
  ) { }

  summarizeTweet(tweet: RelatedContentViewModel<NoteViewModel>): SummarizedTweetContentViewModel {
    return this.tweetContentService.summarizeTweet(tweet);
  }

  getSegments(tweetSummarized: SummarizedTweetContentViewModel, isFull: boolean): NoteContentViewModel {
    if (isFull) {
      return tweetSummarized.note.viewModel.content || [];
    } else {
      return tweetSummarized.summarized;
    }
  }

  getFirstVideoUrl(tweet: RelatedContentViewModel<NoteViewModel> | null): string {
    if (tweet) {
      const content = tweet.viewModel.media
        .filter(media => media.type === 'video')
        .map(media => media.value) || [];
      return content[0] || '';
    }

    return '';
  }

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
}
