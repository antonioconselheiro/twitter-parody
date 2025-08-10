import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TweetEvent } from '@shared/event/tweet.event';
import { PopoverComponent } from '@shared/popover-widget/popover.component';
import { TweetContextMenuHandler } from '@shared/tweet-service/tweet-popover.handler';
import { NoteViewModel } from '@view-model/note.view-model';
import { RelatedContentViewModel } from '@view-model/related-content.view-model';
import { Observable } from 'rxjs';
import { AbstractContextMenuComponent } from '../abstract-context-menu.component';
import { ProfileProxy } from '@belomonte/nostr-ngx';

@Component({
  selector: 'tw-tweet-retweet-context-menu',
  templateUrl: './tweet-retweet-context-menu.component.html',
  styleUrl: './tweet-retweet-context-menu.component.scss'
})
export class TweetRetweetContextMenuComponent extends AbstractContextMenuComponent implements OnInit {

  @ViewChild('tweetRetweet', { read: PopoverComponent })
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
      .retweetMenu
      .asObservable();
    super.ngOnInit();
  }

  retweet(tweet: RelatedContentViewModel<NoteViewModel>): void {
    tweet;
    return;
  }

  retweetWithComment(tweet: RelatedContentViewModel<NoteViewModel>): void {
    tweet;
    return;
  }
}
