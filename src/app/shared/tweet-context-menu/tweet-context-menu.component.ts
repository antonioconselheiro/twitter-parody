import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NoteEvent } from '@shared/event/note.event';
import { PopoverComponent } from '@shared/popover-widget/popover.component';
import { TweetContextMenuHandler } from '@shared/tweet-service/tweet-popover.handler';
import { NoteViewModel } from '@view-model/note.view-model';
import { RelatedContentViewModel } from '@view-model/related-content.view-model';
import { Observable } from 'rxjs';
import { AbstractContextMenuComponent } from './abstract-context-menu.component';

@Component({
  selector: 'tw-tweet-context-menu',
  templateUrl: './tweet-context-menu.component.html',
  styleUrl: './tweet-context-menu.component.scss'
})
export class TweetContextMenuComponent extends AbstractContextMenuComponent implements OnInit {

  @ViewChild('tweetActions', { read: PopoverComponent })
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
      .contextMenu
      .asObservable();
    super.ngOnInit();
  }

  delete(note: RelatedContentViewModel<NoteViewModel>): void {
    note;
    return;
  }

  pin(note: RelatedContentViewModel<NoteViewModel>): void {
    note;
    return;
  }

  toggleFollowUser(note: RelatedContentViewModel<NoteViewModel>): void {
    note;
    return;
  }

  manageUserInLists(note: RelatedContentViewModel<NoteViewModel>): void {
    note;
    return;
  }

  silenceUser(note: RelatedContentViewModel<NoteViewModel>): void {
    note;
    return;
  }

  blockUser(note: RelatedContentViewModel<NoteViewModel>): void {
    note;
    return;
  }

  reportUser(note: RelatedContentViewModel<NoteViewModel>): void {
    note;
    return;
  }

  eventDetails(note: RelatedContentViewModel<NoteViewModel>): void {
    note;
    return;
  }
}
