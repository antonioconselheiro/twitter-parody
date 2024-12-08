import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TweetNostr } from './tweet.nostr';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    TweetNostr
  ]
})
export class TweetServiceModule { }
