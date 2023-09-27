import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfilePictureComponent } from './profile-picture/profile-picture.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    ProfilePictureComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    ProfilePictureComponent
  ]
})
export class ProfileWidgetModule { }
