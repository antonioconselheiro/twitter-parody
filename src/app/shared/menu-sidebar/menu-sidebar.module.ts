import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuSidebarComponent } from './menu-sidebar.component';
import { MenuSidebarMobileComponent } from './menu-sidebar-mobile/menu-sidebar-mobile.component';

@NgModule({
  declarations: [
    MenuSidebarComponent,
    MenuSidebarMobileComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    MenuSidebarComponent,
    MenuSidebarMobileComponent
  ]
})
export class MenuSidebarModule { }
