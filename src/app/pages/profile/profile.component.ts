import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ITweet } from '@domain/tweet.interface';
import { AbstractEntitledComponent } from '@shared/abstract-entitled/abstract-entitled.component';
import { MainErrorObservable } from '@shared/main-error/main-error.observable';
import { NetworkErrorObservable } from '@shared/main-error/network-error.observable';
import { IProfile } from '@shared/profile-service/profile.interface';
import { TweetApi } from '@shared/tweet-service/tweet.api';

@Component({
  selector: 'tw-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent extends AbstractEntitledComponent implements OnInit {

  override title = 'Profile';

  loading = true;

  profile: IProfile | null = null;
  tweets: ITweet[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private error$: MainErrorObservable,
    private networkError$: NetworkErrorObservable,
    private tweetApi: TweetApi,
    private router: Router
  ) {
    super();
  }

  override ngOnInit(): void {
    this.bindTweetSubscription();
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
  
  private bindTweetSubscription(): void {
    const npub = this.activatedRoute.snapshot.params['npub'];
    this.tweetApi.listTweetsFrom(npub)
      .then(tweets => this.tweets = tweets)
      .catch(e => this.networkError$.next(e))
      .finally(() => this.loading = false);
  }
  
  private getProfileFromActivatedRoute(): void {
    this.profile = this.activatedRoute.snapshot.data['profile'];
    if (this.profile) {
      this.title = this.profile.display_name || this.profile.name || 'Profile';
    }
  }
}
