import { Injectable } from '@angular/core';
import { IRetweet } from '@domain/retweet.interface';
import { ITweet } from '@domain/tweet.interface';

@Injectable({
  providedIn: 'root'
})
export class TweetThreadfyConverter {

  constructor() { }

  threadfy(tweets: Array<ITweet | IRetweet>): Array<ITweet | IRetweet | IThread> {
    const indexedTweets: {
      [idEvent: string]: ITweet | IRetweet
    } = {};

    tweets.forEach(tweet => indexedTweets[tweet.id] = tweet);
  }
}
