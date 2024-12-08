import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Account, CurrentAccountObservable } from '@belomonte/nostr-ngx';
import { PopoverComponent } from '@shared/popover-widget/popover.component';
import { TweetConverter } from '@shared/tweet-service/tweet.converter';
import { NoteViewModel } from '@view-model/note.view-model';
import { SimpleTextNoteViewModel } from '@view-model/simple-text-note.view-model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'tw-tweet-button-group',
  templateUrl: './tweet-button-group.component.html',
  styleUrls: ['./tweet-button-group.component.scss']
})
export class TweetButtonGroupComponent implements OnInit, OnDestroy {

  subscriptions = new Subscription();

  @Input()
  tweet: NoteViewModel | null = null;

  @ViewChild('tweetShare', { read: PopoverComponent })
  share!: PopoverComponent;

  profile: Account | null = null;

  constructor(
    private tweetConverter: TweetConverter,
    private profile$: CurrentAccountObservable
  ) { }

  ngOnInit(): void {
    this.bindProfileSubscription();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private bindProfileSubscription(): void {
    this.subscriptions.add(this.profile$.subscribe({
      next: profile => this.profile = profile
    }));
  }

  isRetweetedByYou(tweet: NoteViewModel): boolean {
    return this.tweetTypeGuard.isRetweetedByProfile(tweet, this.profile);
  }

  isLikedByYou(tweet: NoteViewModel): boolean {
    return this.tweetTypeGuard.isLikedByProfile(tweet, this.profile);
  }

  getRetweetedLength(tweet: NoteViewModel): number {
    return this.tweetConverter.getRetweetedLength(tweet);
  }

  getTweetReactionsLength(tweet?: SimpleTextNoteViewModel | null): number {
    return this.tweetConverter.getTweetReactionsLength(tweet);
  }
}
