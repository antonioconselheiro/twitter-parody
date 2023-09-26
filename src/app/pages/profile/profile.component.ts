import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataLoadType } from '@domain/data-load.type';
import { IProfile } from '@domain/profile.interface';
import { ITweet } from '@domain/tweet.interface';
import { AbstractEntitledComponent } from '@shared/abstract-entitled/abstract-entitled.component';
import { MainErrorObservable } from '@shared/main-error/main-error.observable';
import { NetworkErrorObservable } from '@shared/main-error/network-error.observable';
import { AuthenticatedProfileObservable } from '@shared/profile-service/authenticated-profile.observable';
import { ProfileProxy } from '@shared/profile-service/profile.proxy';
import { TweetApi } from '@shared/tweet-service/tweet.api';
import { TweetProxy } from '@shared/tweet-service/tweet.proxy';

@Component({
  selector: 'tw-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent extends AbstractEntitledComponent implements OnInit {

  override title = 'Profile';

  loading = true;

  profile: IProfile | null = null;
  tweets: ITweet<DataLoadType.EAGER_LOADED>[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private error$: MainErrorObservable,
    private networkError$: NetworkErrorObservable,
    private tweetProxy: TweetProxy,
    private profileProxy: ProfileProxy,
    private profile$: AuthenticatedProfileObservable,
    private router: Router
  ) {
    super();
  }

  override ngOnInit(): void {
    this.bindTweetSubscription()
      .catch(e => this.networkError$.next(e))
      .finally(() => this.loading = false);

    this.getProfileFromActivatedRoute();
    super.ngOnInit();
  }

  getProfileBanner(): string {
    if (this.profile && this.profile.banner) {
      return `url("${this.profile.banner}")`;
    } else {
      return `url("/assets/profile/default-banner.jpg")`;
    }
  }

  goHome(): void {
    this.router.navigate(['home']).catch(e => this.error$.next(e));
  }
  
  private async bindTweetSubscription(): Promise<void> {
    const npub = this.activatedRoute.snapshot.params['npub'];
    const tweets = await this.tweetProxy.listTweetsFromNostrPublic(npub);
    //  TODO: check if eager load the related profile is necessary here
    //  if it is, then, implements...

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
}
