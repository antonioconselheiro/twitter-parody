import { Injectable } from '@angular/core';
import { NostrEvent, NostrPool } from '@belomonte/nostr-ngx';
import { TweetInteractFactory } from './tweet-interact.factory';

@Injectable({
  providedIn: 'root'
})
export class TweetInteractProxy {

  constructor(
    private nostrPool: NostrPool,
    private tweetInteractFactory: TweetInteractFactory
  ) { }

  async reactTo(event: NostrEvent<number>, emoji: string): Promise<void> {
    const created = await this.tweetInteractFactory.createReaction(event, emoji);
    return this.nostrPool.publish(created);
  }

  async retweetEvent(retweetThis: NostrEvent<number>): Promise<void> {
    const created = await this.tweetInteractFactory.createSimpleRetweet(retweetThis);
    return this.nostrPool.publish(created);
  }

  async commentEvent(event: NostrEvent<number>, comment: string): Promise<void> {
    const created = await this.tweetInteractFactory.createReply(event, comment);
    return this.nostrPool.publish(created);
  }
}
