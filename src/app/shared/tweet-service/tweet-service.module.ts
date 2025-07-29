import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TweetContextMenuHandler } from './tweet-popover.handler';
import { TweetNostr } from './tweet.nostr';
import { TimelineProxy } from './timeline.proxy';
import { TweetInteractFactory } from './tweet-interact.factory';
import { TweetProxy } from './tweet.proxy';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    TweetProxy,
    TweetNostr,
    TimelineProxy,
    TweetInteractFactory,
    TweetContextMenuHandler
  ]
})
export class TweetServiceModule { }
