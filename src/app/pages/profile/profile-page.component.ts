import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Account, CurrentAccountObservable } from '@belomonte/nostr-ngx';
import { Tweet } from '@domain/tweet.interface';
import { NostrMetadata } from '@nostrify/nostrify';
import { AbstractEntitledComponent } from '@shared/abstract-entitled/abstract-entitled.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'tw-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent extends AbstractEntitledComponent implements OnInit, OnDestroy {

  override title = 'Profile';

  loading = true;

  viewing: Account | null = null;
  authenticated: Account | null = null;

  tweets: Array<Tweet> = [];
  subscriptions = new Subscription();

  constructor(
    private activatedRoute: ActivatedRoute,
    private profile$: CurrentAccountObservable,
    private router: Router
  ) {
    super();
  }

  override ngOnInit(): void {
    this.bindAuthenticatedProfileSubscription();
    this.getProfileFromActivatedRoute();
    this.bindViewingProfile();

    this.loadProfileTweets(this.activatedRoute.snapshot.data['account'])
      .finally(() => this.loading = false);

    super.ngOnInit();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  getProfileBanner(): string {
    if (this.viewing && this.viewing.metadata && this.viewing.metadata.banner) {
      return `url("${this.viewing.metadata.banner}")`;
    } else {
      return `url("/assets/profile/default-banner.jpg")`;
    }
  }

  private bindAuthenticatedProfileSubscription(): void {
    this.subscriptions.add(this.profile$.subscribe({
      next: account => this.viewing = account
    }));
  }

  private bindViewingProfile(): void {
    this.subscriptions.add(this.activatedRoute.data.subscribe({
      next: wrapper => {
        this.viewing = wrapper['profile'];
        this.tweets = [];
        document.body.scrollTo(0, 0);
        this.loadProfileTweets(wrapper['profile']);
      }
    }));
  }
  
  private async loadProfileTweets(account: Account): Promise<void> {
    this.viewing = account;
   //  FIXME: this.tweets = await this.tweetProxy.listTweetsFromPubkey(profile.npub);

    this.subscriptions.add(this.activatedRoute.data.subscribe({
      next: data => this.viewing = data['profile']
    }));
  }
  
  private getProfileFromActivatedRoute(): void {
    this.viewing = this.activatedRoute.snapshot.data['profile'];
    if (this.viewing) {
      this.title = this.viewing.metadata?.display_name || this.viewing.metadata?.name || 'Profile';
      this.loadProfileTweets(this.viewing);
    }
  }

  goHome(): void {
    this.router.navigate(['home']);
  }
}
