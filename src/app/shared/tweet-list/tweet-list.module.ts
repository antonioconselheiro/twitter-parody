import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TweetListComponent } from './tweet-list.component';
import { AmountModule } from '../amount/amount.module';

@NgModule({
  declarations: [
    TweetListComponent
  ],
  imports: [
    CommonModule,
    AmountModule
  ],
  exports: [
    TweetListComponent
  ]
})
export class TweetListModule { }
