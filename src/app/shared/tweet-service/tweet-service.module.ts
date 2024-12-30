import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TweetNostr } from './tweet.nostr';
import { TweetProxy } from './tweet.proxy';
import { TweetThreadfyConverter } from './tweet-threadfy.converter';
import { TweetTagsConverter } from './tweet-tags.converter';
import { TweetContextmenuHandler } from './tweet-contextmenu.handler';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    TweetProxy,
    TweetNostr,
    TweetContextmenuHandler,
    TweetTagsConverter,
    TweetThreadfyConverter
  ]
})
export class TweetServiceModule { }
