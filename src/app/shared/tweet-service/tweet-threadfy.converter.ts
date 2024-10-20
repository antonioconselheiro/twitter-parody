import { Injectable } from '@angular/core';
import { Retweet } from 'src/app/deprecated-domain/retweet.interface';
import { Tweet } from 'src/app/deprecated-domain/tweet.interface';

@Injectable({
  providedIn: 'root'
})
export class TweetThreadfyConverter {

  constructor() { }

  threadfy(tweets: Array<Tweet | Retweet>): Array<Tweet | Retweet | IThread> {
    const indexedTweets: {
      [idEvent: string]: Tweet | Retweet
    } = {};

    tweets.forEach(tweet => indexedTweets[tweet.id] = tweet);
  }
}
