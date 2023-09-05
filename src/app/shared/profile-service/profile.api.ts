import { Injectable } from "@angular/core";
import { NostrEventKind } from "@domain/nostr-event-kind";
import { NostrUser } from "@domain/nostr-user";
import { ITweet } from "@domain/tweet.interface";
import { ApiService } from "@shared/api-service/api.service";
import { Event } from 'nostr-tools';
import { ProfilesObservable } from "./profiles.observable";
import { TweetLoadType } from "@domain/tweet-load-type";
import { IReaction } from "@domain/reaction.interface";

@Injectable()
export class ProfileApi {

  constructor(
    private apiService: ApiService,
    private profiles$: ProfilesObservable
  ) { }

  async listTweets(npub: string): Promise<ITweet[]> {
    const events = await this.apiService.get([
      {
        kinds: [
          NostrEventKind.Text,
          NostrEventKind.Repost,
          NostrEventKind.Reaction
        ],
        authors: [
          String(new NostrUser(npub))
        ]
      }
    ]);

    this.profiles$.cache(events);
    return Promise.resolve(this.castResultsetToTweets(events));
  }

  private castResultsetToTweets(events: Event<NostrEventKind>[]): ITweet[] {
    const tweets: { [id: string]: ITweet } = {};
    //  FIXME: débito técnico, resolver complexidade ciclomática
    // eslint-disable-next-line complexity
    events.forEach(event => {
      if (event.kind === NostrEventKind.Text) {
        const lazyLoaded = tweets[event.id];
        tweets[event.id] = {
          author: this.profiles$.getFromPubKey(event.pubkey),
          content: event.content,
          reactions: lazyLoaded?.reactions || [],
          reply: lazyLoaded?.reply || [],
          created: event.created_at,
          load: TweetLoadType.EAGER_LOADED,
        }
      }

      if (event.kind === NostrEventKind.Repost) {
        const eventTouple = event.tags.find(tag => tag[0] === 'e') || [];
        const idEvent = eventTouple[1];

        const lazyLoaded = tweets[event.id];
        if (!tweets[idEvent]) {
          tweets[idEvent] = {
            reactions: new Array<IReaction>(),
            load: TweetLoadType.LAZY_LOADED
          };
        }

        tweets[event.id] = {
          author: this.profiles$.getFromPubKey(event.pubkey),
          content: event.content,
          reactions: lazyLoaded?.reactions || [],
          reply: lazyLoaded?.reply || [],
          created: event.created_at,
          load: TweetLoadType.EAGER_LOADED,
          retweet: tweets[idEvent]
        }
      }

      if (event.kind === NostrEventKind.Reaction) {
        const [ [, idEvent], [, pubkey] ] = event.tags.find(tag => tag[0] === 'e') || [];

        const reaction: IReaction = {
          author: this.profiles$.getFromPubKey(pubkey),
          content: event.content
        };

        if (!tweets[idEvent]) {
          tweets[idEvent] = {
            reactions: new Array<IReaction>(),
            load: TweetLoadType.LAZY_LOADED
          };
        }

        tweets[idEvent].reactions.push(reaction);
      }
    });

    return Object.values(tweets);
  }


}