import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NoteEvent } from '@shared/event/note.event';
import { PopoverComponent } from '@shared/popover-widget/popover.component';
import { TweetContextMenuHandler } from '@shared/tweet-service/tweet-popover.handler';
import { NoteViewModel } from '@view-model/note.view-model';
import { RelatedContentViewModel } from '@view-model/related-content.view-model';
import { Observable } from 'rxjs';
import { AbstractContextMenuComponent } from '../abstract-context-menu.component';

@Component({
  selector: 'tw-tweet-retweet-context-menu',
  templateUrl: './tweet-retweet-context-menu.component.html',
  styleUrl: './tweet-retweet-context-menu.component.scss'
})
export class TweetRetweetContextMenuComponent extends AbstractContextMenuComponent implements OnInit {

  @ViewChild('tweetRetweet', { read: PopoverComponent })
  popover?: PopoverComponent;

  protected handler!: Observable<NoteEvent | null>;

  constructor(
    elementRef: ElementRef<HTMLElement>,
    tweetPopoverHandler: TweetContextMenuHandler
  ) {
    super(elementRef, tweetPopoverHandler);
  }

  override ngOnInit(): void {
    this.handler = this.tweetPopoverHandler
      .retweetMenu
      .asObservable();
    super.ngOnInit();
  }

  retweet(note: RelatedContentViewModel<NoteViewModel>): void {
    note;
    return;
  }

  retweetWithComment(note: RelatedContentViewModel<NoteViewModel>): void {
    note;
    return;
  }
}
