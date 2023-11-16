import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TweetApi } from './tweet.api';
import { TweetCache } from './tweet.cache';
import { TweetConverter } from './tweet.converter';
import { TweetProxy } from './tweet.proxy';
import { TweetMerge } from './tweet.merge';
import { TweetTypeGuard } from './tweet.type-guard';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    TweetApi,
    TweetProxy,
    TweetMerge,
    TweetConverter,
    TweetCache,
    TweetTypeGuard
  ]
})
export class TweetServiceModule { }
