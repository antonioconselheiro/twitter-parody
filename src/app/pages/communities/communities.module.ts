import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommunitiesComponent } from './communities.component';

@NgModule({
  declarations: [
    CommunitiesComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CommunitiesComponent
  ]
})
export class CommunitiesModule { }
