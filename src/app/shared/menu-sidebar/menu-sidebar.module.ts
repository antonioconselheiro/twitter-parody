import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CredentialManagerWidgetModule, ProfileWidgetModule } from '@belomonte/nostr-credential-ngx';
import { PopoverWidgetModule } from '@shared/popover-widget/popover-widget.module';
import { MenuActiveObservable } from './menu-active.observable';
import { MenuSidebarMobileComponent } from './menu-sidebar-mobile/menu-sidebar-mobile.component';
import { MenuSidebarMobileObservable } from './menu-sidebar-mobile/menu-sidebar-mobile.observable';
import { MenuSidebarComponent } from './menu-sidebar/menu-sidebar.component';
import { MobileBottomNavigationComponent } from './mobile-bottom-navigation/mobile-bottom-navigation.component';

@NgModule({
  declarations: [
    MenuSidebarComponent,
    MenuSidebarMobileComponent,
    MobileBottomNavigationComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    PopoverWidgetModule,
    ProfileWidgetModule,
    CredentialManagerWidgetModule
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
