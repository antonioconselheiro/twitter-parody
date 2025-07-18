import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractContextMenuComponent } from '@shared/context-menu/abstract-context-menu.component';
import { NoteEvent } from '@shared/event/note.event';
import { PopoverComponent } from '@shared/popover-widget/popover.component';
import { TweetContextMenuHandler } from '@shared/tweet-service/tweet-popover.handler';
import { NoteViewModel } from '@view-model/note.view-model';
import { RelatedContentViewModel } from '@view-model/related-content.view-model';
import { Observable } from 'rxjs';

@Component({
  selector: 'tw-tweet-share-context-menu',
  templateUrl: './tweet-share-context-menu.component.html',
  styleUrl: './tweet-share-context-menu.component.scss'
})
export class TweetShareContextMenuComponent extends AbstractContextMenuComponent implements OnInit {

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

  copyLink(note: RelatedContentViewModel<NoteViewModel>): void {
    note;
    return;
  }

  sendPrivateMessage(note: RelatedContentViewModel<NoteViewModel>): void {
    note;
    return;
  }

  bookmarket(note: RelatedContentViewModel<NoteViewModel>): void {
    note;
    return;
  }
}
