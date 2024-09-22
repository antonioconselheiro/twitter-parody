import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AuthenticatedAccountObservable } from '@belomonte/nostr-ngx';
import { IRetweet } from '@domain/retweet.interface';
import { Tweet } from '@domain/tweet.interface';
import { PopoverComponent } from '@shared/popover-widget/popover.component';
import { TweetConverter } from '@shared/tweet-service/tweet.converter';
import { TweetTypeGuard } from '@shared/tweet-service/tweet.type-guard';
import { Subscription } from 'rxjs';
import { NostrMetadata } from '@nostrify/nostrify';

@Component({
  selector: 'tw-tweet-button-group',
  templateUrl: './tweet-button-group.component.html',
  styleUrls: ['./tweet-button-group.component.scss']
})
export class TweetButtonGroupComponent implements OnInit, OnDestroy {

  subscriptions = new Subscription();

  @Input()
  tweet: Tweet | IRetweet | null = null;

  @ViewChild('tweetShare', { read: PopoverComponent })
  share!: PopoverComponent;

  profile: NostrMetadata | null = null;

  constructor(
    private tweetConverter: TweetConverter,
    private tweetTypeGuard: TweetTypeGuard,
    private profile$: AuthenticatedAccountObservable
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

  isRetweetedByYou(tweet: Tweet | IRetweet): boolean {
    return this.tweetTypeGuard.isRetweetedByProfile(tweet, this.profile);
  }

  isLikedByYou(tweet: Tweet | IRetweet): boolean {
    return this.tweetTypeGuard.isLikedByProfile(tweet, this.profile);
  }

  getRetweetedLength(tweet: Tweet | IRetweet): number {
    return this.tweetConverter.getRetweetedLength(tweet);
  }

  getTweetReactionsLength(tweet?: Tweet | null): number {
    return this.tweetConverter.getTweetReactionsLength(tweet);
  }
}
