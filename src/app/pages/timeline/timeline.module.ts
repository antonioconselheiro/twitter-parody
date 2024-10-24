import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TimelineComponent } from './timeline.component';

@NgModule({
  declarations: [
    TimelineComponent
  ],
  imports: [
    CommonModule,
    // TweetWidgetModule,
    // ProfileWidgetModule
  ]
})
export class TimelineModule { }
