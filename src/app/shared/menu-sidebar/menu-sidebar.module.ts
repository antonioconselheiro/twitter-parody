import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuSidebarComponent } from './menu-sidebar/menu-sidebar.component';
import { MenuSidebarMobileComponent } from './menu-sidebar-mobile/menu-sidebar-mobile.component';
import { MenuSidebarMobileObservable } from './menu-sidebar-mobile/menu-sidebar-mobile.observable';
import { MobileBottomNavigationComponent } from './mobile-bottom-navigation/mobile-bottom-navigation.component';
import { MenuActiveObservable } from './menu-active.observable';
import { AuthModalModule } from '@shared/auth-modal/auth-modal.module';

@NgModule({
  declarations: [
    MenuSidebarComponent,
    MenuSidebarMobileComponent,
    MobileBottomNavigationComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
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
