import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PopoverComponent } from '@shared/popover-widget/popover.component';
import { Theme } from '@shared/theme/theme.interface';
import { ThemeObservable } from '@shared/theme/theme.observable';
import { TweetPopoverHandler } from '@shared/tweet-service/tweet-popover.handler';
import { NoteViewModel } from '@view-model/note.view-model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'tw-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  private subscriptions = new Subscription();
  isModalOpen = false;
  contextMenuPosition: DOMRect | null = null;

  @ViewChild('tweetActions', { read: PopoverComponent })
  tweetActions?: PopoverComponent;

  constructor(
    private theme$: ThemeObservable,
    private tweetPopoverHandler: TweetPopoverHandler
  ) { }

  ngOnInit(): void {
    this.bindThemes();
    this.listenPopoverHandler();
  }

  private listenPopoverHandler(): void {
    this.subscriptions.add(this.tweetPopoverHandler
      .popover$
      .asObservable()
      .subscribe({
        next: aggregator => this.setPopoverState(aggregator)
      }));
  }

  private bindThemes(): void {
    this.subscriptions.add(this.theme$.subscribe({
      next: theme => this.setCurrentTheme(theme)
    }));
  }

  private setPopoverState(aggregator: { note: NoteViewModel, trigger: HTMLElement } | null): void {
    if (!this.tweetActions) {
      return;
    }

    if (aggregator) {
      this.contextMenuPosition = aggregator.trigger.getBoundingClientRect();
      this.tweetActions.show();

    } else {
      this.tweetActions.hide();
    }
  }

  private setCurrentTheme(theme: Theme): void {
    if (['darker', 'light', 'dark'].includes(theme.base)) {
      document.body.setAttribute('data-theme', theme.base);
    }

    if (['blue', 'yellow', 'magenta', 'purple', 'orange', 'green'].includes(theme.color)) {
      document.body.setAttribute('data-color', theme.color);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
