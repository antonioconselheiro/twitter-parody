import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
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

  constructor(
    private menuSidebarMobile$: MenuSidebarMobileObservable
  ) { }

  ngOnInit(): void {
    this.subscriptions.add(this.menuSidebarMobile$.subscribe({
      next: show => this.showing = show
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  close(): void {
    this.showing = false;
  }
}
