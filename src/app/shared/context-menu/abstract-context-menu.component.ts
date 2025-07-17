import { Directive, ElementRef, OnDestroy, OnInit } from "@angular/core";
import { NoteEvent } from "@shared/event/note.event";
import { PopoverComponent } from "@shared/popover-widget/popover.component";
import { TweetContextMenuHandler } from "@shared/tweet-service/tweet-popover.handler";
import { NoteViewModel } from "@view-model/note.view-model";
import { RelatedContentViewModel } from "@view-model/related-content.view-model";
import { Observable, Subscription } from "rxjs";

@Directive()
export abstract class AbstractContextMenuComponent implements OnInit, OnDestroy {

  protected subscriptions = new Subscription();

  contextMenuPosition: number | null = null;
  note: RelatedContentViewModel<NoteViewModel> | null = null;

  abstract popover?: PopoverComponent;
  protected abstract handler: Observable<NoteEvent | null>;

  constructor(
    protected elementRef: ElementRef<HTMLElement>,
    protected tweetPopoverHandler: TweetContextMenuHandler
  ) { }

  ngOnInit(): void {
    this.listenPopoverHandler();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private listenPopoverHandler(): void {
    this.subscriptions.add(this.handler.subscribe(
      aggregator => this.setPopoverState(aggregator)
    ));
  }

  private setPopoverState(aggregator: { note: RelatedContentViewModel<NoteViewModel>, trigger: HTMLElement } | null): void {
    if (!this.popover) {
      return;
    }

    if (aggregator && aggregator.note) {
      const triggerRect = aggregator.trigger.getBoundingClientRect();
      const thisRect = this.elementRef.nativeElement.getBoundingClientRect();
      const negative = -1;
      this.contextMenuPosition = (thisRect.top * negative) + triggerRect.top;
      this.popover.show();
      this.note = aggregator.note;

    } else {
      this.popover.hide();
      this.note = null;
    }
  }
}