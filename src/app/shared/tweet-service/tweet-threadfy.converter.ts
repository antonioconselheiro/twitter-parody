import { Injectable } from '@angular/core';
import { TEventId } from '@domain/event-id.type';
import { IRetweet } from '@domain/retweet.interface';
import { ITweet } from '@domain/tweet.interface';

@Injectable({
  providedIn: 'root'
})
export class TweetThreadfyConverter {

  constructor() { }

  threadfy(tweets: Array<ITweet | IRetweet>): Array<ITweet | IRetweet | IThread> {
    const indexedTweets: {
      [idEvent: TEventId]: ITweet | IRetweet
    } = {};

    tweets.forEach(tweet => indexedTweets[tweet.id] = tweet);
  }
}
