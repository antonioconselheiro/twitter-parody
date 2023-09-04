import { Component, OnInit } from '@angular/core';
import { AbstractEntitledComponent } from '@shared/abstract-entitled/abstract-entitled.component';
import { MenuSidebarMobileObservable } from '@shared/menu-sidebar/menu-sidebar-mobile/menu-sidebar-mobile.observable';

@Component({
  selector: 'tw-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent extends AbstractEntitledComponent implements OnInit {
  title = 'Home';

  constructor(
    private menuSidebarMobile$: MenuSidebarMobileObservable
  ) {
    super();
  }

  openSideMenu() {
    this.menuSidebarMobile$.open();
  }
}
