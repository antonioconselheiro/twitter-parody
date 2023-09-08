import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TimelineComponent } from './timeline.component';
import { TweetWidgetModule } from '@shared/tweet-widget/tweet-widget.module';

@NgModule({
  declarations: [
    TimelineComponent
  ],
  imports: [
    CommonModule,
    TweetWidgetModule
  ]
})
export class TimelineModule { }
