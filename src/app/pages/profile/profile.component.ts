import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ITweet } from '@domain/tweet.interface';
import { AbstractEntitledComponent } from '@shared/abstract-entitled/abstract-entitled.component';
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

  profile: IProfile | null = null;
  tweets: ITweet[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private networkError$: NetworkErrorObservable,
    private tweetApi: TweetApi
  ) {
    super();
  }

  override ngOnInit(): void {
    this.bindTweetSubscription();
    this.getProfileFromActivatedRoute();
    super.ngOnInit();
  }
  
  private bindTweetSubscription(): void {
    const npub = this.activatedRoute.snapshot.params['npub'];
    this.tweetApi.listTweetsFrom(npub)
      .then(tweets => this.tweets = tweets)
      .catch(e => this.networkError$.next(e));
  }
  
  private getProfileFromActivatedRoute(): void {
    this.profile = this.activatedRoute.snapshot.data['profile'];
    if (this.profile) {
      this.title = this.profile.display_name || this.profile.name || 'Profile';
    }
  }
}
