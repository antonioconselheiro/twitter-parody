import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TweetListComponent } from './tweet-list.component';
import { AmountModule } from '../amount/amount.module';
import { TweetButtonGroupComponent } from './tweet-button-group/tweet-button-group.component';

@NgModule({
  declarations: [
    TweetListComponent,
    TweetButtonGroupComponent
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
