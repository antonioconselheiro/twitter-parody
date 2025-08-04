import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FeedNostr } from './feed.nostr';
import { TimelineProxy } from './timeline.proxy';
import { TweetInteractFactory } from './tweet-interact.factory';
import { TweetContextMenuHandler } from './tweet-popover.handler';
import { TweetNostr } from './tweet.nostr';
import { TweetProxy } from './tweet.proxy';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    FeedNostr,
    TweetProxy,
    TweetNostr,
    TimelineProxy,
    TweetInteractFactory,
    TweetContextMenuHandler
  ]
})
export class TweetServiceModule { }
