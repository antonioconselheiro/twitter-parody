import { Injectable } from "@angular/core";
import { NostrEventKind } from "@domain/nostr-event-kind";
import { NostrUser } from "@domain/nostr-user";
import { IReaction } from "@domain/reaction.interface";
import { DataLoadType } from "@domain/data-load-type";
import { ITweet } from "@domain/tweet.interface";
import { ApiService } from "@shared/api-service/api.service";
import { Event } from 'nostr-tools';
import { ProfilesObservable } from "./profiles.observable";
import Geohash from "latlon-geohash";

@Injectable()
export class TweetApi {

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

  private isKind<T extends NostrEventKind>(event: Event<NostrEventKind>, kind: T): event is Event<T>  {
    if (event.kind === kind) {
      return true;
    }

    return false;
  }

  private castResultsetToTweets(events: Event<NostrEventKind>[]): ITweet[] {
    const tweetsMap: { [id: string]: ITweet } = {};
    //  FIXME: débito técnico, resolver complexidade ciclomática
    // eslint-disable-next-line complexity
    events.forEach(event => {
      if (this.isKind(event, NostrEventKind.Text) || this.isKind(event, NostrEventKind.Repost)) {
        const lazyLoaded = tweetsMap[event.id];
        tweetsMap[event.id] = this.castEventToTweet(tweetsMap, event, lazyLoaded);
      }

      if (this.isKind(event, NostrEventKind.Reaction)) {
        const [ [, idEvent], [, pubkey] ] = event.tags.find(tag => tag[0] === 'e') || [];

        const reaction: IReaction = {
          author: this.profiles$.getFromPubKey(pubkey),
          content: event.content
        };

        if (!tweetsMap[idEvent]) {
          tweetsMap[idEvent] = this.createLazyLoadableTweetFromEventId(idEvent);
        }

        tweetsMap[idEvent].reactions.push(reaction);
      }
    });

    return Object.values(tweetsMap);
  }

  // eslint-disable-next-line complexity
  private castEventToTweet(tweetsMap: { [id: string]: ITweet }, event: Event<NostrEventKind.Text>, tweet?: ITweet): ITweet;
  private castEventToTweet(tweetsMap: { [id: string]: ITweet }, event: Event<NostrEventKind.Repost>, tweet?: ITweet): ITweet;
  private castEventToTweet(tweetsMap: { [id: string]: ITweet }, event: Event<NostrEventKind.Text | NostrEventKind.Repost>, tweet?: ITweet): ITweet;
  private castEventToTweet(tweetsMap: { [id: string]: ITweet }, event: Event<NostrEventKind.Text> | Event<NostrEventKind.Repost>, tweet?: ITweet): ITweet {
    tweet = {
      id: event.id,
      author: this.profiles$.getFromPubKey(event.pubkey),
      content: this.getTweetContent(event, tweet),
      reactions: tweet?.reactions || [],
      reply: tweet?.reply || [],
      created: this.getTweetCreated(event, tweet),
      load: DataLoadType.EAGER_LOADED,
    }

    this.getCoordinatesFromEvent(tweet, event);
    this.getRetweetingFromEvent(tweetsMap, tweet, event);

    return tweet;
  }

  private getRetweetingFromEvent(tweetsMap: { [idEvent: string]: ITweet }, tweet: ITweet, event: Event<NostrEventKind>): void {
    if (this.isKind(event, NostrEventKind.Repost)) {
      const [,idEvent] = event.tags.find(tag => tag[0] === 'e') || [];

      if (!tweetsMap[idEvent]) {
        tweetsMap[idEvent] = this.createLazyLoadableTweetFromEventId(idEvent);
      }

      tweetsMap[event.id].retweeting = tweetsMap[idEvent];
    }
  }
  
  private getCoordinatesFromEvent(tweet: ITweet, event: Event<NostrEventKind>): ITweet {
    const [,geohash] = event.tags.find(tag => tag[0] === 'g') || [];
    if (geohash) {
      tweet.location = Geohash.decode(geohash);
    }

    return tweet;
  }

  private createLazyLoadableTweetFromEventId(idEvent: string): ITweet {
    return {
      id: idEvent,
      reactions: new Array<IReaction>(),
      load: DataLoadType.LAZY_LOADED
    };
  }

  private getTweetContent(event: Event<NostrEventKind.Text | NostrEventKind.Repost>, tweet?: ITweet): string {
    return event.content || tweet?.content || '';
  }

  private getTweetCreated(event: Event<NostrEventKind.Text | NostrEventKind.Repost>, tweet?: ITweet): number {
    return event.created_at || tweet?.created || 0;
  }

}