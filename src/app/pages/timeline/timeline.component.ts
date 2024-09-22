import { Component, OnDestroy, OnInit } from '@angular/core';
import { NostrMetadata } from '@nostrify/nostrify';
import { AuthenticatedAccountObservable } from '@belomonte/nostr-ngx';
import { AbstractEntitledComponent } from '@shared/abstract-entitled/abstract-entitled.component';
import { MainErrorObservable } from '@shared/main-error/main-error.observable';
import { MenuSidebarMobileObservable } from '@shared/menu-sidebar/menu-sidebar-mobile/menu-sidebar-mobile.observable';
import { Subscription } from 'rxjs';

@Component({
  selector: 'tw-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent extends AbstractEntitledComponent implements OnInit, OnDestroy {

  override title = 'Home';
  private subscriptions = new Subscription();

  authProfile?: NostrMetadata;

  constructor(
    private menuSidebarMobile$: MenuSidebarMobileObservable,
    private profiles$: AuthenticatedAccountObservable,
    private error$: MainErrorObservable
  ) {
    super();
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.bindProfileSubscription();
  }
  
  private bindProfileSubscription(): void {
    this.subscriptions.add(this.profiles$.subscribe({
      next: profile => this.authProfile = profile?.metadata,
      error: error => this.error$.next(error)
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  openSideMenu(): void {
    this.menuSidebarMobile$.open();
  }
}
