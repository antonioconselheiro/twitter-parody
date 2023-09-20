import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TweetApi } from './tweet.api';
import { TweetHtmlfyService } from './tweet-htmlfy.service';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    TweetApi,
    TweetHtmlfyService
  ]
})
export class TweetServiceModule { }
