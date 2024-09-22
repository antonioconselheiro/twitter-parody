import { Injectable } from '@angular/core';
import { IRetweet } from '@domain/retweet.interface';
import { Tweet } from '@domain/tweet.interface';

@Injectable({
  providedIn: 'root'
})
export class TweetThreadfyConverter {

  constructor() { }

  threadfy(tweets: Array<Tweet | IRetweet>): Array<Tweet | IRetweet | IThread> {
    const indexedTweets: {
      [idEvent: string]: Tweet | IRetweet
    } = {};

    tweets.forEach(tweet => indexedTweets[tweet.id] = tweet);
  }
}
