import { Component, HostBinding, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MenuSidebarMobileObservable } from './menu-sidebar-mobile.observable';

@Component({
  selector: 'tw-menu-sidebar-mobile',
  templateUrl: './menu-sidebar-mobile.component.html',
  styleUrls: ['./menu-sidebar-mobile.component.scss']
})
export class MenuSidebarMobileComponent implements OnInit, OnDestroy {

  private subscriptions = new Subscription();

  @HostBinding('class.active')
  showing = false;

  touchStart = 0;

  constructor(
    private menuSidebarMobile$: MenuSidebarMobileObservable
  ) { }

  ngOnInit(): void {
    this.subscriptions.add(this.menuSidebarMobile$.subscribe({
      next: show => this.showing = show
    }));
  }

  @HostListener('document:touchstart', ['$event'])
  onTouchStart(e: TouchEvent): void {
    this.touchStart = e.touches[0].clientX;
  }
  
  @HostListener('document:touchend', ['$event'])
  onTouchEnd(e: TouchEvent): void {
    const touches = e.touches[0] || e.changedTouches[0];

    if (touches.clientX > (this.touchStart + 200)) {
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
