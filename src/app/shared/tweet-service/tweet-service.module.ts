import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TweetApi } from './tweet.api';
import { TweetHtmlfyService } from './tweet-htmlfy.service';
import { TweetConverter } from './tweet.converter';
import { TweetStatefull } from './tweet.statefull';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    TweetApi,
    TweetConverter,
    TweetStatefull,
    TweetHtmlfyService
  ]
})
export class TweetServiceModule { }
