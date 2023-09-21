import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthModalModule } from '@shared/auth-modal/auth-modal.module';
import { PopoverWidgetModule } from '@shared/popover-widget/popover-widget.module';
import { ProfileWidgetModule } from '@shared/profile-widget/profile-widget.module';
import { MenuActiveObservable } from './menu-active.observable';
import { AccountsListMobileComponent } from './menu-sidebar-mobile/accounts-list-mobile/accounts-list-mobile.component';
import { MenuSidebarMobileComponent } from './menu-sidebar-mobile/menu-sidebar-mobile.component';
import { MenuSidebarMobileObservable } from './menu-sidebar-mobile/menu-sidebar-mobile.observable';
import { MenuSidebarComponent } from './menu-sidebar/menu-sidebar.component';
import { MobileBottomNavigationComponent } from './mobile-bottom-navigation/mobile-bottom-navigation.component';

@NgModule({
  declarations: [
    MenuSidebarComponent,
    MenuSidebarMobileComponent,
    MobileBottomNavigationComponent,
    AccountsListMobileComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    PopoverWidgetModule,
    ProfileWidgetModule,
    AuthModalModule
  ],
  exports: [
    MenuSidebarComponent,
    MenuSidebarMobileComponent,
    MobileBottomNavigationComponent
  ],
  providers: [
    MenuActiveObservable,
    MenuSidebarMobileObservable
  ]
})
export class MenuSidebarModule { }
