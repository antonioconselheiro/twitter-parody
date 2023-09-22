import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TweetApi } from './tweet.api';
import { TweetHtmlfyService } from './tweet-htmlfy.service';
import { TweetConverter } from './tweet.converter';
import { TweetCache } from './tweet.cache';
import { TweetFacade } from './tweet.proxy';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    TweetApi,
    TweetFacade,
    TweetConverter,
    TweetCache,
    TweetHtmlfyService
  ]
})
export class TweetServiceModule { }
