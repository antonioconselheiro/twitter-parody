import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TweetContextMenuHandler } from './tweet-popover.handler';
import { TweetNostr } from './tweet.nostr';
import { TimelineProxy } from './timeline.proxy';
import { TweetInteractFactory } from './tweet-interact.factory';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    TimelineProxy,
    TweetNostr,
    TweetInteractFactory,
    TweetContextMenuHandler
  ]
})
export class TweetServiceModule { }
