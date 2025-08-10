import { Directive, ElementRef, OnDestroy, OnInit } from "@angular/core";
import { Account, HexString, ProfileProxy } from "@belomonte/nostr-ngx";
import { TweetEvent } from "@shared/event/tweet.event";
import { PopoverComponent } from "@shared/popover-widget/popover.component";
import { TweetContextMenuHandler } from "@shared/tweet-service/tweet-popover.handler";
import { NoteViewModel } from "@view-model/note.view-model";
import { RelatedContentViewModel } from "@view-model/related-content.view-model";
import { Observable, Subscription } from "rxjs";

@Directive()
export abstract class AbstractContextMenuComponent implements OnInit, OnDestroy {

  protected subscriptions = new Subscription();

  triggerPosition: { top: number, left: number } | null = null;
  tweet: RelatedContentViewModel<NoteViewModel> | null = null;
  account: Account | null = null;

  abstract popover?: PopoverComponent;
  protected abstract handler: Observable<TweetEvent | null>;

  constructor(
    protected profileProxy: ProfileProxy,
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

  private setPopoverState(aggregator: { tweet: RelatedContentViewModel<NoteViewModel>, trigger: HTMLElement } | null): void {
    if (!this.popover) {
      return;
    }

    if (aggregator && aggregator.tweet) {
      const triggerRect = aggregator.trigger.getBoundingClientRect();
      const thisRect = this.elementRef.nativeElement.getBoundingClientRect();
      const negative = -1;
      const top = (thisRect.top * negative) + triggerRect.top;
      const left = (thisRect.left * negative) + triggerRect.left;
      const pubkey = aggregator.tweet.viewModel.author?.pubkey;

      this.triggerPosition = { top, left };
      this.popover.show();
      this.tweet = aggregator.tweet;
      if (pubkey) {
        this.account = this.profileProxy.getAccount(pubkey);
      } else {
        this.account = null;
      }
    } else {
      this.popover.hide();
      this.tweet = null;
      this.account = null;
    }
  }

  getAccount(pubkey: HexString | undefined): Account | null {
    if (!pubkey) {
      return null;
    }

    return this.profileProxy.getAccount(pubkey);
  }
}