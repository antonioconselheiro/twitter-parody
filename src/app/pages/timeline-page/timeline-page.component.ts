import { Component, OnDestroy, OnInit } from '@angular/core';
import { AccountRenderable, CurrentProfileObservable } from '@belomonte/nostr-ngx';
import { AbstractEntitledComponent } from '@shared/abstract-entitled/abstract-entitled.component';
import { MenuSidebarMobileObservable } from '@shared/menu-sidebar/menu-sidebar-mobile/menu-sidebar-mobile.observable';
import { Subscription } from 'rxjs';

@Component({
  selector: 'tw-timeline-page',
  templateUrl: './timeline-page.component.html',
  styleUrls: ['./timeline-page.component.scss']
})
export class TimelineComponent extends AbstractEntitledComponent implements OnInit, OnDestroy {

  override title = 'Home';
  private subscriptions = new Subscription();

  account: AccountRenderable | null = null;

  constructor(
    private menuSidebarMobile$: MenuSidebarMobileObservable,
    private profile$: CurrentProfileObservable
  ) {
    super();
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.listenProfileSubscription();
  }

  private listenProfileSubscription(): void {
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
