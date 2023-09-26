import { Injectable } from '@angular/core';
import { DataLoadType } from '@domain/data-load.type';
import { TEventId } from '@domain/event-id.type';
import { ITweet } from '@domain/tweet.interface';

@Injectable({
  providedIn: 'root'
})
export class TweetMerge {

  mergeLazyLoadedTweets<T>(
    receiveMerge: ITweet<T>, lazyTweet: ITweet<DataLoadType.LAZY_LOADED>
  ): ITweet<T> {
    this.mergeReactions(receiveMerge, lazyTweet);
    this.mergeZaps(receiveMerge, lazyTweet);
    this.mergeAuthor(receiveMerge, lazyTweet);
    this.mergeRepling(receiveMerge, lazyTweet);
    this.mergeRetweeting(receiveMerge, lazyTweet);
    this.mergeReplies(receiveMerge, lazyTweet);
    this.mergeRetweetedBy(receiveMerge, lazyTweet);

    return receiveMerge;
  }

  private mergeReactions<T>(
    receiveMerge: ITweet<T>, lazyTweet: ITweet<DataLoadType.LAZY_LOADED>
  ): void {
    receiveMerge.reactions = Object.assign(receiveMerge.reactions, lazyTweet.reactions);
  }

  private mergeZaps<T>(
    receiveMerge: ITweet<T>, lazyTweet: ITweet<DataLoadType.LAZY_LOADED>
  ): void {
    receiveMerge.zaps = Object.assign(receiveMerge.zaps, lazyTweet.zaps);
  }

  private mergeAuthor<T>(
    receiveMerge: ITweet<T>, lazyTweet: ITweet<DataLoadType.LAZY_LOADED>
  ): void {
    receiveMerge.author = receiveMerge.author || lazyTweet.author;
    if (!receiveMerge.author) {
      delete receiveMerge.author;
    }
  }

  private mergeRepling<T>(
    receiveMerge: ITweet<T>, lazyTweet: ITweet<DataLoadType.LAZY_LOADED>
  ): void {
    receiveMerge.repling = receiveMerge.repling || lazyTweet.repling;
    if (!receiveMerge.repling) {
      delete receiveMerge.repling;
    }
  }

  private mergeRetweeting<T>(
    receiveMerge: ITweet<T>, lazyTweet: ITweet<DataLoadType.LAZY_LOADED>
  ): void {
    receiveMerge.retweeting = receiveMerge.retweeting || lazyTweet.retweeting;
    if (!receiveMerge.retweeting) {
      delete receiveMerge.retweeting;
    }
  }

  private mergeReplies<T>(
    receiveMerge: ITweet<T>, lazyTweet: ITweet<DataLoadType.LAZY_LOADED>
  ): void {
    receiveMerge.replies = [
      ...new Set(new Array<TEventId>()
      .concat(receiveMerge.replies || [])
      .concat(lazyTweet.replies || []))
    ];
  }

  private mergeRetweetedBy<T>(
    receiveMerge: ITweet<T>, lazyTweet: ITweet<DataLoadType.LAZY_LOADED>
  ): void {
    receiveMerge.retweetedBy = [
      ...new Set(new Array<TEventId>()
      .concat(receiveMerge.retweetedBy || [])
      .concat(lazyTweet.retweetedBy || []))
    ];
  }
}
