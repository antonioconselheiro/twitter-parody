import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuSidebarComponent } from './menu-sidebar.component';

@NgModule({
  declarations: [
    MenuSidebarComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    MenuSidebarComponent
  ]
})
export class MenuSidebarModule { }
