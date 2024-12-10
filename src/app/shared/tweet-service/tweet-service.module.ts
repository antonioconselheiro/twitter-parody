import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TweetNostr } from './tweet.nostr';
import { TweetProxy } from './tweet.proxy';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    TweetProxy,
    TweetNostr
  ]
})
export class TweetServiceModule { }
