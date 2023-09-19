import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ProfileWidgetModule } from '@shared/profile-widget/profile-widget.module';
import { TweetWidgetModule } from '@shared/tweet-widget/tweet-widget.module';
import { ProfileComponent } from './profile.component';

@NgModule({
  declarations: [
    ProfileComponent
  ],
  imports: [
    CommonModule,
    ProfileWidgetModule,
    TweetWidgetModule
  ],
  exports: [
    ProfileComponent
  ]
})
export class ProfileModule { }
