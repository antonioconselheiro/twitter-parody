import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TweetListModule } from '../shared/tweet-list/tweet-list.module';
import { TimelineComponent } from './timeline.component';

@NgModule({
  declarations: [
    TimelineComponent
  ],
  imports: [
    CommonModule,
    TweetListModule
  ]
})
export class TimelineModule { }
