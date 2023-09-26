import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TweetApi } from './tweet.api';
import { TweetCache } from './tweet.cache';
import { TweetConverter } from './tweet.converter';
import { TweetFacade } from './tweet.proxy';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    TweetApi,
    TweetFacade,
    TweetConverter,
    TweetCache
  ]
})
export class TweetServiceModule { }
