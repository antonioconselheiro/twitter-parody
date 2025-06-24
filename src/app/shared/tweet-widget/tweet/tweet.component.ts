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
    //  FIXME: revisar implementação de como será decidido quando este botão será exibido
    return true;
  }

}
