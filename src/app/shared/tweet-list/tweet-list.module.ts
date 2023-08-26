import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TweetListComponent } from './tweet-list.component';

@NgModule({
  declarations: [
    TweetListComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    TweetListComponent
  ]
})
export class TweetListModule { }
