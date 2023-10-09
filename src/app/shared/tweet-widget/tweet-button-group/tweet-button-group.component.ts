import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataLoadType } from '@domain/data-load.type';
import { IProfile } from '@domain/profile.interface';
import { IRetweet } from '@domain/retweet.interface';
import { ITweet } from '@domain/tweet.interface';
import { PopoverComponent } from '@shared/popover-widget/popover.component';
import { AuthenticatedProfileObservable } from '@shared/profile-service/authenticated-profile.observable';
import { TweetConverter } from '@shared/tweet-service/tweet.converter';
import { TweetTypeGuard } from '@shared/tweet-service/tweet.type-guard';
import { Subscription } from 'rxjs';

@Component({
  selector: 'tw-tweet-button-group',
  templateUrl: './tweet-button-group.component.html',
  styleUrls: ['./tweet-button-group.component.scss']
})
export class TweetButtonGroupComponent implements OnInit, OnDestroy {

  readonly EAGER_LOADED = DataLoadType.EAGER_LOADED;
  readonly LAZY_LOADED = DataLoadType.LAZY_LOADED;

  subscriptions = new Subscription();

  @Input()
  tweet: ITweet | IRetweet | null = null;

  @ViewChild('tweetShare', { read: PopoverComponent })
  share!: PopoverComponent;

  profile: IProfile | null = null;

  constructor(
    private tweetConverter: TweetConverter,
    private tweetTypeGuard: TweetTypeGuard,
    private profile$: AuthenticatedProfileObservable
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

  isRetweetedByYou(tweet: ITweet | IRetweet): boolean {
    return this.tweetTypeGuard.isRetweetedByProfile(tweet, this.profile);
  }

  isLikedByYou(tweet: ITweet | IRetweet): boolean {
    return this.tweetTypeGuard.isLikedByProfile(tweet, this.profile);
  }

  getRetweetedLength(tweet: ITweet | IRetweet): number {
    return this.tweetConverter.getRetweetedLength(tweet);
  }

  getTweetReactionsLength(tweet?: ITweet | null): number {
    return this.tweetConverter.getTweetReactionsLength(tweet);
  }
}
