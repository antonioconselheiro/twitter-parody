import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataLoadType } from '@domain/data-load.type';
import { IProfile } from '@domain/profile.interface';
import { ITweet } from '@domain/tweet.interface';
import { AbstractEntitledComponent } from '@shared/abstract-entitled/abstract-entitled.component';
import { MainErrorObservable } from '@shared/main-error/main-error.observable';
import { NetworkErrorObservable } from '@shared/main-error/network-error.observable';
import { AuthenticatedProfileObservable } from '@shared/profile-service/authenticated-profile.observable';
import { TweetProxy } from '@shared/tweet-service/tweet.proxy';
import { Subscription } from 'rxjs';

@Component({
  selector: 'tw-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent extends AbstractEntitledComponent implements OnInit, OnDestroy {

  override title = 'Profile';

  loading = true;

  profile: IProfile | null = null;
  authProfile: IProfile | null = null;

  tweets: ITweet<DataLoadType.EAGER_LOADED>[] = [];
  subscriptions = new Subscription();

  constructor(
    private activatedRoute: ActivatedRoute,
    private profile$: AuthenticatedProfileObservable,
    private error$: MainErrorObservable,
    private networkError$: NetworkErrorObservable,
    private tweetProxy: TweetProxy,
    private router: Router
  ) {
    super();
  }

  override ngOnInit(): void {
    this.bindAuthenticatedProfileSubscription();
    this.bindTweetSubscription()
      .catch(e => this.networkError$.next(e))
      .finally(() => this.loading = false);

    this.getProfileFromActivatedRoute();
    super.ngOnInit();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  getProfileBanner(): string {
    if (this.profile && this.profile.banner) {
      return `url("${this.profile.banner}")`;
    } else {
      return `url("/assets/profile/default-banner.jpg")`;
    }
  }

  private bindAuthenticatedProfileSubscription(): void {
    this.subscriptions.add(this.profile$.subscribe({
      next: profile => this.authProfile = profile
    }));
  }
  
  private async bindTweetSubscription(): Promise<void> {
    const npub = this.activatedRoute.snapshot.params['npub'];
    const tweets = await this.tweetProxy.listTweetsFromNostrPublic(npub);

    this.tweets = tweets.filter(
      (tweet): tweet is ITweet<DataLoadType.EAGER_LOADED> => tweet.load === DataLoadType.EAGER_LOADED
    );
  }
  
  private getProfileFromActivatedRoute(): void {
    this.profile = this.activatedRoute.snapshot.data['profile'];
    if (this.profile) {
      this.title = this.profile.display_name || this.profile.name || 'Profile';
    }
  }

  goHome(): void {
    this.router.navigate(['home']).catch(e => this.error$.next(e));
  }
}
