import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TimelineComponent } from './timeline.component';
import { TweetWidgetModule } from '@shared/tweet-widget/tweet-widget.module';
import { ProfileWidgetModule } from '@shared/profile-widget/profile-widget.module';

@NgModule({
  declarations: [
    TimelineComponent
  ],
  imports: [
    CommonModule,
    ProfileWidgetModule,
    TweetWidgetModule
  ]
})
export class TimelineModule { }
