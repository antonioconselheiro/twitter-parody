import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Account, CurrentAccountObservable } from '@belomonte/nostr-ngx';
import { AbstractEntitledComponent } from '@shared/abstract-entitled/abstract-entitled.component';
import { TweetProxy } from '@shared/tweet-service/tweet.proxy';
import { FeedViewModel } from '@view-model/feed.view-model';
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

  feed: FeedViewModel | null = null;
  subscriptions = new Subscription();

  constructor(
    private activatedRoute: ActivatedRoute,
    private profile$: CurrentAccountObservable,
    private tweetProxy: TweetProxy,
    private router: Router
  ) {
    super();
  }

  override ngOnInit(): void {
    this.bindAuthenticatedProfileSubscription();
    this.getProfileFromActivatedRoute();
    this.bindViewingProfile();
    this.loadProfileFeed(this.activatedRoute.snapshot.data['account']);

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
        this.feed = null;
        document.body.scrollTo(0, 0);
        this.loadProfileFeed(wrapper['profile']);
      }
    }));
  }

  private loadProfileFeed(account: Account | null): void {
    this.viewing = account;
    if (account) {
      this.tweetProxy
        .listTweetsFromPubkey(account.pubkey)
        .subscribe(feed => {
          this.loading = false
          this.feed = feed;
        });
    } else {
      this.feed = null;
    }
  }

  private getProfileFromActivatedRoute(): void {
    this.viewing = this.activatedRoute.snapshot.data['profile'];
    this.subscriptions.add(this.activatedRoute.data.subscribe({
      next: data => this.viewing = data['profile']
    }));

    if (this.viewing) {
      this.title = this.viewing.metadata?.display_name || this.viewing.metadata?.name || 'Profile';
      this.loadProfileFeed(this.viewing);
    }
  }

  goHome(): void {
    this.router.navigate(['home']);
  }
}
