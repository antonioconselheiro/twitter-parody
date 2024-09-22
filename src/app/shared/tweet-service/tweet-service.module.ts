import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TweetApi } from './tweet.api';
import { TweetConverter } from './tweet.converter';
import { TweetTypeGuard } from './tweet.type-guard';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    TweetApi,
    TweetConverter,
    TweetTypeGuard
  ]
})
export class TweetServiceModule { }
