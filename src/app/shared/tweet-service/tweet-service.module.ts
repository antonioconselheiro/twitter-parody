import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TweetContextMenuHandler } from './tweet-popover.handler';
import { TweetNostr } from './tweet.nostr';
import { TweetProxy } from './tweet.proxy';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    TweetProxy,
    TweetNostr,
    TweetContextMenuHandler
  ]
})
export class TweetServiceModule { }
