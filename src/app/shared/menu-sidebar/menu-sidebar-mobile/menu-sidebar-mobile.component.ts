import { Component, HostBinding, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MenuSidebarMobileObservable } from './menu-sidebar-mobile.observable';
import { ProfilesObservable } from '@shared/profile-service/profiles.observable';
import { IProfile } from '@shared/profile-service/profile.interface';

@Component({
  selector: 'tw-menu-sidebar-mobile',
  templateUrl: './menu-sidebar-mobile.component.html',
  styleUrls: ['./menu-sidebar-mobile.component.scss']
})
export class MenuSidebarMobileComponent implements OnInit, OnDestroy {

  private subscriptions = new Subscription();

  @HostBinding('class.active')
  showing = false;

  profile: IProfile | null = null;

  touchStart = 0;

  constructor(
    private profile$: ProfilesObservable,
    private menuSidebarMobile$: MenuSidebarMobileObservable
  ) { }

  ngOnInit(): void {
    this.bindProfileSubscription();
    this.bindMenuShowingSubscription();
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
