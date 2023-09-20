import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TweetApi } from './tweet.api';
import { TweetHtmlfyService } from './tweet-htmlfy.service';
import { TweetConverter } from './tweet.converter';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    TweetApi,
    TweetConverter,
    TweetHtmlfyService
  ]
})
export class TweetServiceModule { }
