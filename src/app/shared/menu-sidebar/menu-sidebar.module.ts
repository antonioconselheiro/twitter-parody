import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuSidebarComponent } from './menu-sidebar/menu-sidebar.component';
import { MenuSidebarMobileComponent } from './menu-sidebar-mobile/menu-sidebar-mobile.component';
import { MenuSidebarMobileObservable } from './menu-sidebar-mobile/menu-sidebar-mobile.observable';
import { MobileBottomNavigationComponent } from './mobile-bottom-navigation/mobile-bottom-navigation.component';
import { MenuActiveObservable } from './menu-active.observable';
import { AuthModalModule } from '@shared/auth-modal/auth-modal.module';
import { ProfileWidgetModule } from '@shared/profile-widget/profile-widget.module';
import { AccountsListMobileComponent } from './menu-sidebar-mobile/accounts-list-mobile/accounts-list-mobile.component';

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
