import { Component, HostBinding, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MenuSidebarMobileObservable } from './menu-sidebar-mobile.observable';
import { AuthProfileObservable } from '@shared/profile-service/profiles.observable';
import { IProfile } from '@shared/profile-service/profile.interface';
import { MenuType } from '../menu-type.enum';
import { MenuActiveObservable } from '../menu-active.observable';

@Component({
  selector: 'tw-menu-sidebar-mobile',
  templateUrl: './menu-sidebar-mobile.component.html',
  styleUrls: ['./menu-sidebar-mobile.component.scss']
})
export class MenuSidebarMobileComponent implements OnInit, OnDestroy {

  private subscriptions = new Subscription();

  readonly MENU_TYPE_LISTS = MenuType.LISTS;
  readonly MENU_TYPE_BOOKMARKS = MenuType.BOOKMARKS;
  readonly MENU_TYPE_COMMUNITIES = MenuType.COMMUNITIES;
  readonly MENU_TYPE_PROFILE = MenuType.PROFILE;

  @HostBinding('class.active')
  showing = false;

  profile: IProfile | null = null;
  menuActive: MenuType | null = null;

  touchStart = 0;

  constructor(
    private profile$: AuthProfileObservable,
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
      profile => this.profile = profile
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

  terms(): void {
    alert('Ancestral property of King Jesus Christ');
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  close(): void {
    this.menuSidebarMobile$.close();
  }
}
