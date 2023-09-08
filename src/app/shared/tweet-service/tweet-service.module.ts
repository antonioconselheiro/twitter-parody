import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TweetApi } from './tweet.api';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    TweetApi
  ]
})
export class TweetServiceModule { }
