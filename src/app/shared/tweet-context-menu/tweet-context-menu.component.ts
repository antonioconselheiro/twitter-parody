import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PopoverComponent } from '@shared/popover-widget/popover.component';
import { TweetContextmenuHandler } from '@shared/tweet-service/tweet-contextmenu.handler';
import { NoteViewModel } from '@view-model/note.view-model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'tw-tweet-context-menu',
  templateUrl: './tweet-context-menu.component.html',
  styleUrl: './tweet-context-menu.component.scss'
})
export class TweetContextMenuComponent implements OnInit, OnDestroy {

  private subscriptions = new Subscription();

  contextMenuPosition: number | null = null;
  note: NoteViewModel | null = null;

  @ViewChild('tweetActions', { read: PopoverComponent })
  tweetActions?: PopoverComponent;

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    private tweetPopoverHandler: TweetContextmenuHandler
  ) { }

  ngOnInit(): void {
    this.listenPopoverHandler();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private listenPopoverHandler(): void {
    this.subscriptions.add(this.tweetPopoverHandler
      .popover$
      .asObservable()
      .subscribe({
        next: aggregator => this.setPopoverState(aggregator)
      }));
  }

  private setPopoverState(aggregator: { note: NoteViewModel, trigger: HTMLElement } | null): void {
    if (!this.tweetActions) {
      return;
    }

    if (aggregator && aggregator.note) {
      const triggerRect = aggregator.trigger.getBoundingClientRect();
      const thisRect = this.elementRef.nativeElement.getBoundingClientRect();
      const negative = -1;
      this.contextMenuPosition = (thisRect.top * negative) + triggerRect.top;
      this.tweetActions.show();
      this.note = aggregator.note;

    } else {
      this.tweetActions.hide();
      this.note = null;
    }
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
