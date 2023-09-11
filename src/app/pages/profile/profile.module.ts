import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ProfileComponent } from './profile.component';
import { TweetWidgetModule } from '@shared/tweet-widget/tweet-widget.module';
import { ProfileWidgetModule } from '@shared/profile-widget/profile-widget.module';

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
