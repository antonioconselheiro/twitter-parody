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

  readonly MENU_TYPE_HOME = MenuType.HOME;
  readonly MENU_TYPE_EXPLORE = MenuType.EXPLORE;
  readonly MENU_TYPE_NOTIFICATIONS = MenuType.NOTIFICATIONS;
  readonly MENU_TYPE_MESSAGES = MenuType.MESSAGES;

  menuActive: MenuType | null = null;

  constructor(
    private menuActive$: MenuActiveObservable
  ) { }

  ngOnInit(): void {
    this.bindMenuActiveSubscription();
  }

  private bindMenuActiveSubscription(): void {
    this.subscriptions.add(this.menuActive$.subscribe(
      menu => this.menuActive = menu
    ));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
