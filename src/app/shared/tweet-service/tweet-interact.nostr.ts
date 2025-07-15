import { Injectable } from '@angular/core';
import { NostrEvent, NostrPool } from '@belomonte/nostr-ngx';
import { TweetInteractFactory } from './tweet-interact.factory';

@Injectable({
  providedIn: 'root'
})
export class TweetInteractProxy {

  constructor(
    private npool: NostrPool,
    private tweetInteractFactory: TweetInteractFactory
  ) { }

  async reactTo(event: NostrEvent<number>, emoji: string): Promise<void> {
    const created = await this.tweetInteractFactory.createReaction(event, emoji);
    return this.npool.event(created);
  }

  async retweetEvent(retweetThis: NostrEvent<number>): Promise<void> {
    const created = await this.tweetInteractFactory.createSimpleRetweet(retweetThis);
    return this.npool.event(created);
  }

  async commentEvent(event: NostrEvent<number>, comment: string): Promise<void> {
    const created = await this.tweetInteractFactory.createReply(event, comment);
    return this.npool.event(created);
  }
}
