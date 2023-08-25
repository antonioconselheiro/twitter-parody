import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuSidebarComponent } from './menu-sidebar.component';

@NgModule({
  declarations: [
    MenuSidebarComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    MenuSidebarComponent
  ]
})
export class MenuSidebarModule { }
