import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataLoadType } from '@domain/data-load.type';
import { IProfile } from '@domain/profile.interface';
import { IRetweet } from '@domain/retweet.interface';
import { ITweet } from '@domain/tweet.interface';
import { PopoverComponent } from '@shared/popover-widget/popover.component';
import { AuthenticatedProfileObservable } from '@shared/profile-service/authenticated-profile.observable';
import { ProfileProxy } from '@shared/profile-service/profile.proxy';
import { TweetConverter } from '@shared/tweet-service/tweet.converter';
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
    private profileProxy: ProfileProxy,
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
    if (!this.profile) {
      return false;
    }

    const showingTweet = this.tweetConverter.getShowingTweet(tweet);
    if (!showingTweet.retweetedBy) {
      return false;
    }

    return showingTweet.retweetedBy.includes(this.profile.npub);
  }

  isLikedByYou(tweet: ITweet | IRetweet): boolean {
    const reactions = Object.values(tweet.reactions);
    const profile = this.profile;
    if (!profile || !reactions.length) {
      return false;
    }

    console.info('tweet', tweet);
    console.info('author', profile);
    console.info('reactions', reactions, reactions.map(reaction => reaction.author && this.profileProxy.get(reaction.author) || null));
    return !!reactions.find(reaction => reaction.author === profile.npub)
  }

  getTweetReactions(tweet?: ITweet | null): number {
    return this.tweetConverter.getTweetReactionsLength(tweet);
  }
}
