import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommunitySidebarComponent } from './community-sidebar.component';

@NgModule({
  declarations: [
    CommunitySidebarComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CommunitySidebarComponent
  ]
})
export class CommunitySidebarModule { }
