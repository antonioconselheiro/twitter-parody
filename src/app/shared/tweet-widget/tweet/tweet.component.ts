import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Account, HexString, ProfileProxy } from '@belomonte/nostr-ngx';
import { TweetContextMenuHandler } from '@shared/tweet-service/tweet-popover.handler';
import { NoteViewModel } from '@view-model/note.view-model';
import { RelatedContentViewModel } from '@view-model/related-content.view-model';
import { TweetImageViewing } from '../tweet-img-viewing.interface';

@Component({
  selector: 'tw-tweet',
  templateUrl: './tweet.component.html',
  styleUrl: './tweet.component.scss'
})
export class TweetComponent {

  @Output()
  imageOpen = new EventEmitter<TweetImageViewing | null>();
  
  @Input()
  tweet!: RelatedContentViewModel<NoteViewModel>;

  @Input()
  isFull = false;

  constructor(
    private profileProxy: ProfileProxy,
    private tweetPopoverHandler: TweetContextMenuHandler
  ) { }

  openTweetContextMenu(tweet: RelatedContentViewModel<NoteViewModel>, trigger: HTMLElement): void {
    this.tweetPopoverHandler.handleOptionsContextMenu({ tweet, trigger });
  }

  onImageOpen(img: TweetImageViewing | null): void {
    this.imageOpen.next(img);
  }

  getAccount(pubkey: HexString | undefined): Account | null {
    if (!pubkey) {
      return null;
    }

    return this.profileProxy.getAccount(pubkey);
  }
}
