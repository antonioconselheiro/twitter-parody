import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TweetImageViewing } from '../tweet-img-viewing.interface';
import { NoteViewModel } from '@view-model/note.view-model';
import { Account, AccountRenderable } from '@belomonte/nostr-ngx';

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
  note: NoteViewModel<Account> | null = null;

  @Output()
  imgOpen = new EventEmitter<TweetImageViewing | null>();

  showMoreTextButton(): boolean {
    const smallViewLength = String(this.note?.content?.smallView || '').length
    const fullViewLength = String(this.note?.content?.fullView || '').length;

    return smallViewLength !== fullViewLength;
  }

  getImages(): [string, string?][] {
    const images: [string, string?][] = [];
    let currentImage!: [string, string?];

    new Array<string>()
      .concat(this.note?.media?.imageList || [])
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
