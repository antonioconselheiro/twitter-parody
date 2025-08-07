import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuActiveObservable } from '../menu-active.observable';
import { MenuType } from '../menu-type.enum';
import { Subscription } from 'rxjs';

@Component({
  selector: 'tw-mobile-bottom-navigation',
  templateUrl: './mobile-bottom-navigation.component.html',
  styleUrls: ['./mobile-bottom-navigation.component.scss']
})
export class MobileBottomNavigationComponent implements OnInit, OnDestroy {

  private subscriptions = new Subscription();

  readonly menuTypeHome = MenuType.HOME;
  readonly menuTypeExplore = MenuType.EXPLORE;
  readonly menuTypeNotifications = MenuType.NOTIFICATIONS;
  readonly menuTypeMessages = MenuType.MESSAGES;

  menuActive: MenuType | null = null;

  constructor(
    private menuActive$: MenuActiveObservable
  ) { }

  ngOnInit(): void {
    this.listenMenuActiveSubscription();
  }

  private listenMenuActiveSubscription(): void {
    this.subscriptions.add(this.menuActive$.subscribe(
      menu => this.menuActive = menu
    ));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
