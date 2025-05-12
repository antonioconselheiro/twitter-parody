import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PopoverComponent } from '@shared/popover-widget/popover.component';
import { TweetContextMenuHandler } from '@shared/tweet-service/tweet-popover.handler';
import { NoteViewModel } from '@view-model/note.view-model';
import { AbstractContextMenuComponent } from './abstract-context-menu.component';
import { Observable } from 'rxjs';
import { RelatedContentViewModel } from '@view-model/related-content.view-model';

@Component({
  selector: 'tw-tweet-context-menu',
  templateUrl: './tweet-context-menu.component.html',
  styleUrl: './tweet-context-menu.component.scss'
})
export class TweetContextMenuComponent extends AbstractContextMenuComponent implements OnInit {

  @ViewChild('tweetActions', { read: PopoverComponent })
  popover?: PopoverComponent;

  protected handler!: Observable<{ note: RelatedContentViewModel<NoteViewModel>; trigger: HTMLElement; } | null>;

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

  delete(note: NoteViewModel): void {
    note;
    return;
  }

  pin(note: NoteViewModel): void {
    note;
    return;
  }

  toggleFollowUser(note: NoteViewModel): void {
    note;
    return;
  }

  manageUserInLists(note: NoteViewModel): void {
    note;
    return;
  }

  silenceUser(note: NoteViewModel): void {
    note;
    return;
  }

  blockUser(note: NoteViewModel): void {
    note;
    return;
  }

  reportUser(note: NoteViewModel): void {
    note;
    return;
  }

  eventDetails(note: NoteViewModel): void {
    note;
    return;
  }
}
