import { kinds } from 'nostr-tools';
import { Injectable } from "@angular/core";
import { NostrEvent, NostrRawEvent, NostrSigner } from "@belomonte/nostr-ngx";

@Injectable()
export class TweetInteractFactory {

  constructor(
    private nostrSigner: NostrSigner
  ) { }

  createReaction(event: NostrEvent<number>, emoji: string): Promise<NostrEvent> {
    const reactionEvent: NostrRawEvent = {
      kind: kinds.Reaction,
      content: emoji,
      tags: [
        ['e', event.id]
      ]
    };

    return Promise.resolve(this.nostrSigner.signEvent(reactionEvent));
  }

  createSimpleRetweet(retweetThis: NostrEvent<number>): Promise<NostrEvent> {
    //  FIXME: no 'e' precisa ser enviada a informação do relay onde o evento compartilhado está
    const retweetEvent: NostrRawEvent = {
      kind: kinds.Repost,
      content: JSON.stringify(retweetThis),
      tags: [
        ['e', retweetThis.id]
      ]
    };

    return Promise.resolve(this.nostrSigner.signEvent(retweetEvent));
  }

  createRetweetWithComments(comment: string): Promise<NostrEvent> {

  }

  createReply(event: NostrEvent<number>, comment: string): Promise<NostrEvent> {
    const replyEvent: NostrRawEvent = {
      kind: kinds.Repost,
      content: comment,
      tags: [
        ['e', event.id]
      ]
    };

    return Promise.resolve(this.nostrSigner.signEvent(replyEvent));
  }

}