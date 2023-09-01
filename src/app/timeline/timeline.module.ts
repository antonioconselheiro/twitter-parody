import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TweetModule } from '../shared/tweet/tweet.module';
import { TimelineComponent } from './timeline.component';

@NgModule({
  declarations: [
    TimelineComponent
  ],
  imports: [
    CommonModule,
    TweetModule
  ]
})
export class TimelineModule { }
