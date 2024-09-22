import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthenticatedAccountObservable } from '@belomonte/nostr-ngx';
import { AbstractEntitledComponent } from '@shared/abstract-entitled/abstract-entitled.component';
import { MenuSidebarMobileObservable } from '@shared/menu-sidebar/menu-sidebar-mobile/menu-sidebar-mobile.observable';
import { Account } from 'node_modules/@belomonte/nostr-ngx/lib/domain/account.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'tw-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent extends AbstractEntitledComponent implements OnInit, OnDestroy {

  override title = 'Home';
  private subscriptions = new Subscription();

  account: Account | null = null;

  constructor(
    private menuSidebarMobile$: MenuSidebarMobileObservable,
    private profile$: AuthenticatedAccountObservable
  ) {
    super();
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.bindProfileSubscription();
  }
  
  private bindProfileSubscription(): void {
    this.subscriptions.add(this.profile$.subscribe({
      next: account => this.account = account
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  openSideMenu(): void {
    this.menuSidebarMobile$.open();
  }
}
