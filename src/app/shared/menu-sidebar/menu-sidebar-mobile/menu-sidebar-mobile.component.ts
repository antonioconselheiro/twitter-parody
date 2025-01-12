import { Component, HostBinding, HostListener, OnDestroy, OnInit } from '@angular/core';
import { AccountRenderable, CurrentAccountObservable } from '@belomonte/nostr-ngx';
import { Subscription } from 'rxjs';
import { MenuActiveObservable } from '../menu-active.observable';
import { MenuType } from '../menu-type.enum';
import { MenuSidebarMobileObservable } from './menu-sidebar-mobile.observable';

@Component({
  selector: 'tw-menu-sidebar-mobile',
  templateUrl: './menu-sidebar-mobile.component.html',
  styleUrls: ['./menu-sidebar-mobile.component.scss']
})
export class MenuSidebarMobileComponent implements OnInit, OnDestroy {

  private subscriptions = new Subscription();

  readonly menuTypeLists = MenuType.LISTS;
  readonly menuTypeBookmarks = MenuType.BOOKMARKS;
  readonly menuTypeCommunities = MenuType.COMMUNITIES;
  readonly menuTypeProfile = MenuType.PROFILE;

  @HostBinding('class.active')
  showing = false;

  account: AccountRenderable | null = null;
  menuActive: MenuType | null = null;

  touchStart = 0;

  constructor(
    private profile$: CurrentAccountObservable,
    private menuActive$: MenuActiveObservable,
    private menuSidebarMobile$: MenuSidebarMobileObservable
  ) { }

  ngOnInit(): void {
    this.bindProfileSubscription();
    this.bindMenuShowingSubscription();
    this.bindMenuActiveSubscription();
  }

  private bindMenuShowingSubscription(): void {
    this.subscriptions.add(this.menuSidebarMobile$.subscribe({
      next: show => this.showing = show
    }));
  }

  private bindProfileSubscription(): void {
    this.subscriptions.add(this.profile$.subscribe(
      account => this.account = account
    ));
  }

  private bindMenuActiveSubscription(): void {
    this.subscriptions.add(this.menuActive$.subscribe(
      menu => this.menuActive = menu
    ));
  }

  @HostListener('document:touchstart', ['$event'])
  onTouchStart(e: TouchEvent): void {
    this.touchStart = e.touches[0].clientX;
  }

  @HostListener('document:touchend', ['$event'])
  onTouchEnd(e: TouchEvent): void {
    const touches = e.touches[0] || e.changedTouches[0];

    const amountToDetectDrag = 200;
    if (touches.clientX > (this.touchStart + amountToDetectDrag)) {
      this.menuSidebarMobile$.open();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  close(): void {
    this.menuSidebarMobile$.close();
  }
}
