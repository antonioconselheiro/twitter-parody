import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ProfileWidgetModule } from '@shared/profile-widget/profile-widget.module';
import { TweetWidgetModule } from '@shared/tweet-widget/tweet-widget.module';
import { TimelineComponent } from './timeline.component';

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
