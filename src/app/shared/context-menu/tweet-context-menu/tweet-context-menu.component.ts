import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Account, ProfileProxy } from '@belomonte/nostr-ngx';
import { TweetEvent } from '@shared/event/tweet.event';
import { PopoverComponent } from '@shared/popover-widget/popover.component';
import { TweetContextMenuHandler } from '@shared/tweet-service/tweet-popover.handler';
import { NoteViewModel } from '@view-model/note.view-model';
import { RelatedContentViewModel } from '@view-model/related-content.view-model';
import { Observable } from 'rxjs';
import { AbstractContextMenuComponent } from '../abstract-context-menu.component';

@Component({
  selector: 'tw-tweet-context-menu',
  templateUrl: './tweet-context-menu.component.html',
  styleUrl: './tweet-context-menu.component.scss'
})
export class TweetContextMenuComponent extends AbstractContextMenuComponent implements OnInit {

  @ViewChild('tweetActions', { read: PopoverComponent })
  popover?: PopoverComponent;

  protected handler!: Observable<TweetEvent | null>;

  constructor(
    profileProxy: ProfileProxy,
    elementRef: ElementRef<HTMLElement>,
    tweetPopoverHandler: TweetContextMenuHandler
  ) {
    super(profileProxy, elementRef, tweetPopoverHandler);
  }

  override ngOnInit(): void {
    this.handler = this.tweetPopoverHandler
      .optionsMenu
      .asObservable();
    super.ngOnInit();
  }

  delete(tweet: RelatedContentViewModel<NoteViewModel>): void {
    tweet;
    return;
  }

  pin(tweet: RelatedContentViewModel<NoteViewModel>): void {
    tweet;
    return;
  }

  toggleFollowUser(account: Account): void {
    account;
    return;
  }

  manageUserInLists(account: Account): void {
    account;
    return;
  }

  silenceUser(account: Account): void {
    account;
    return;
  }

  blockUser(account: Account): void {
    account;
    return;
  }

  reportUser(account: Account): void {
    account;
    return;
  }

  eventDetails(tweet: RelatedContentViewModel<NoteViewModel>): void {
    tweet;
    return;
  }
}
