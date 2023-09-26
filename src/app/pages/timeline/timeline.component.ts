import { Component, OnDestroy, OnInit } from '@angular/core';
import { IProfile } from '@domain/profile.interface';
import { AbstractEntitledComponent } from '@shared/abstract-entitled/abstract-entitled.component';
import { MainErrorObservable } from '@shared/main-error/main-error.observable';
import { MenuSidebarMobileObservable } from '@shared/menu-sidebar/menu-sidebar-mobile/menu-sidebar-mobile.observable';
import { AuthenticatedProfileObservable } from '@shared/profile-service/authenticated-profile.observable';
import { Subscription } from 'rxjs';

@Component({
  selector: 'tw-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent extends AbstractEntitledComponent implements OnInit, OnDestroy {

  override title = 'Home';
  private subscriptions = new Subscription();

  authProfile: IProfile | null = null;

  constructor(
    private menuSidebarMobile$: MenuSidebarMobileObservable,
    private profiles$: AuthenticatedProfileObservable,
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
      next: profile => this.authProfile = profile,
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
