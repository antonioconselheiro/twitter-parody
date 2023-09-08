import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ProfileComponent } from './profile.component';
import { TweetWidgetModule } from '@shared/tweet-widget/tweet-widget.module';

@NgModule({
  declarations: [
    ProfileComponent
  ],
  imports: [
    CommonModule,
    TweetWidgetModule
  ],
  exports: [
    ProfileComponent
  ]
})
export class ProfileModule { }
