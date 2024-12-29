import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TweetNostr } from './tweet.nostr';
import { TweetProxy } from './tweet.proxy';
import { TweetThreadfyConverter } from './tweet-threadfy.converter';
import { TweetTagsConverter } from './tweet-tags.converter';
import { TweetPopoverHandler } from './tweet-popover.handler';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    TweetProxy,
    TweetNostr,
    TweetPopoverHandler,
    TweetTagsConverter,
    TweetThreadfyConverter
  ]
})
export class TweetServiceModule { }
