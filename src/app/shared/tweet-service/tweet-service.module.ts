import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TweetContextMenuHandler } from './tweet-popover.handler';
import { TweetNostr } from './tweet.nostr';
import { TweetProxy } from './tweet.proxy';
import { TweetInteractFactory } from './tweet-interact.factory';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    TweetProxy,
    TweetNostr,
    TweetInteractFactory,
    TweetContextMenuHandler
  ]
})
export class TweetServiceModule { }
