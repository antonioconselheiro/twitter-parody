import { Component, OnDestroy, OnInit } from '@angular/core';
import { NostrSecretStatefull } from '@shared/security-service/nostr-secret.statefull';
import { IUnauthenticatedUser } from '@shared/security-service/unauthenticated-user';
import { Subscription } from 'rxjs';

@Component({
  selector: 'tw-accounts-list-mobile',
  templateUrl: './accounts-list-mobile.component.html',
  styleUrls: ['./accounts-list-mobile.component.scss']
})
export class AccountsListMobileComponent implements OnInit, OnDestroy {

  private subscriptions = new Subscription();

  accounts: IUnauthenticatedUser[] = [];

  constructor(
    private nostrSecretStatefull: NostrSecretStatefull
  ) { }

  ngOnInit(): void {
    this.subscriptions.add(this.nostrSecretStatefull.accounts$.subscribe({
      next: accounts => this.accounts = accounts
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
