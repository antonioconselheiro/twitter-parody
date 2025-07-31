import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TweetContextMenuHandler } from './tweet-popover.handler';
import { TweetNostr } from './tweet.nostr';
import { TimelineProxy } from './timeline.proxy';
import { TweetInteractFactory } from './tweet-interact.factory';
import { TweetProxy } from './tweet.proxy';
import { FeedNostr } from './feed.nostr';
import { FeedProxy } from './feed.proxy';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    FeedProxy,
    FeedNostr,
    TweetProxy,
    TweetNostr,
    TimelineProxy,
    TweetInteractFactory,
    TweetContextMenuHandler
  ]
})
export class TweetServiceModule { }
