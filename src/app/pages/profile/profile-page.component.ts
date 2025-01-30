import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Account, AccountComplete, AccountSession, CurrentAccountObservable } from '@belomonte/nostr-ngx';
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

  viewing: AccountComplete | null = null;
  authenticated: AccountSession | null = null;

  feed: FeedViewModel<Account> | null = null;
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
    this.loadAccountFeed(this.activatedRoute.snapshot.data['profile']);
    this.bindAuthenticatedProfileSubscription();
    this.getAccountFromActivatedRoute();
    this.bindViewingProfile();

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
      next: account => this.authenticated = account
    }));
  }

  private bindViewingProfile(): void {
    this.subscriptions.add(this.activatedRoute.data.subscribe({
      next: ({ account }) => {
        this.feed = null;
        document.body.scrollTo(0, 0);
        this.loadAccountFeed(account);
      }
    }));
  }

  private loadAccountFeed(account: AccountComplete | null): void {
    this.viewing = account;
    this.loading = true;
    if (account) {
      this.tweetProxy
        .loadTimeline(account.pubkey)
        .subscribe(feed => {
          this.loading = false;
          this.feed = feed;
        });
    } else {
      this.loading = false;
      this.feed = null;
    }
  }

  private getAccountFromActivatedRoute(): void {
    this.viewing = this.activatedRoute.snapshot.data['account'];
    this.subscriptions.add(this.activatedRoute.data.subscribe({
      next: data => this.viewing = data['account']
    }));

    if (this.viewing) {
      this.title = this.viewing.displayName || 'Profile';
      this.loadAccountFeed(this.viewing);
    }
  }

  goHome(): void {
    this.router.navigate(['home']);
  }
}
