import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NoteEvent } from '@shared/event/note.event';
import { PopoverComponent } from '@shared/popover-widget/popover.component';
import { AbstractContextMenuComponent } from '@shared/tweet-context-menu/abstract-context-menu.component';
import { TweetContextMenuHandler } from '@shared/tweet-service/tweet-popover.handler';
import { NoteViewModel } from '@view-model/note.view-model';
import { Observable } from 'rxjs';

@Component({
  selector: 'tw-tweet-share',
  templateUrl: './tweet-share.component.html',
  styleUrl: './tweet-share.component.scss'
})
export class TweetShareComponent extends AbstractContextMenuComponent implements OnInit {

  @ViewChild('tweetShare', { read: PopoverComponent })
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
      .shareMenu
      .asObservable();
    super.ngOnInit();
  }

  copyLink(note: NoteViewModel): void {
    note;
    return;
  }

  sendPrivateMessage(note: NoteViewModel): void {
    note;
    return;
  }

  bookmarket(note: NoteViewModel): void {
    note;
    return;
  }
}
