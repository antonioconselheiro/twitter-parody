import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Account, AuthenticatedAccountObservable } from '@belomonte/nostr-ngx';
import { Tweet } from '@domain/tweet.interface';
import { NostrMetadata } from '@nostrify/nostrify';
import { AbstractEntitledComponent } from '@shared/abstract-entitled/abstract-entitled.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'tw-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent extends AbstractEntitledComponent implements OnInit, OnDestroy {

  override title = 'Profile';

  loading = true;

  profile: NostrMetadata | null = null;
  account: Account | null = null;

  tweets: Array<Tweet> = [];
  subscriptions = new Subscription();

  constructor(
    private activatedRoute: ActivatedRoute,
    private profile$: AuthenticatedAccountObservable,
    private router: Router
  ) {
    super();
  }

  override ngOnInit(): void {
    this.bindAuthenticatedProfileSubscription();
    this.loadProfileTweets(this.activatedRoute.snapshot.data['profile'])
      .finally(() => this.loading = false);

    this.getProfileFromActivatedRoute();
    this.bindViewingProfile();
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
      next: account => this.account = account
    }));
  }

  private bindViewingProfile(): void {
    this.subscriptions.add(this.activatedRoute.data.subscribe({
      next: wrapper => {
        this.profile = wrapper['profile'];
        this.tweets = [];
        document.body.scrollTo(0, 0);
        this.loadProfileTweets(wrapper['profile']);
      }
    }));
  }
  
  private async loadProfileTweets(profile: NostrMetadata): Promise<void> {
    this.profile = profile;
   //  this.tweets = await this.tweetProxy.listTweetsFromPubkey(profile.npub);

    this.subscriptions.add(this.activatedRoute.data.subscribe({
      next: data => this.profile = data['profile']
    }));
  }
  
  private getProfileFromActivatedRoute(): void {
    this.profile = this.activatedRoute.snapshot.data['profile'];
    if (this.profile) {
      this.title = this.profile.display_name || this.profile.name || 'Profile';
      this.loadProfileTweets(this.profile);
    }
  }

  goHome(): void {
    this.router.navigate(['home']);
  }
}
