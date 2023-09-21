import { Injectable } from "@angular/core";
import { NostrEventKind } from "@domain/nostr-event-kind";
import { NostrUser } from "@domain/nostr-user";
import { ITweet } from "@domain/tweet.interface";
import { ApiService } from "@shared/api-service/api.service";
import { ProfilesObservable } from "../profile-service/profiles.observable";
import { TweetConverter } from "./tweet.converter";
import { DataLoadType } from "@domain/data-load.type";

@Injectable({
  providedIn: 'root'
})
export class TweetApi {

  constructor(
    private tweetConverter: TweetConverter,
    private profiles$: ProfilesObservable,
    private apiService: ApiService
  ) { }

  async listTweetsFrom(npub: string): Promise<ITweet<DataLoadType.EAGER_LOADED>[]> {
    const events = await this.apiService.get([
      {
        kinds: [
          NostrEventKind.Metadata,
          NostrEventKind.Text,
          NostrEventKind.Repost
        ],
        authors: [
          String(new NostrUser(npub))
        ],
        limit: 20
      }
    ]);

    this.profiles$.cache(events);

    const tweets = this.tweetConverter.castResultsetToTweets(events);
    return Promise.resolve(tweets);
  }

  async listReactionsFrom(npub: string): Promise<ITweet[]> {
    const events = await this.apiService.get([
      {
        kinds: [
          NostrEventKind.Metadata,
          NostrEventKind.Reaction
        ],
        authors: [
          String(new NostrUser(npub))
        ],
        limit: 20
      }
    ]);

    this.profiles$.cache(events);

    const tweets = this.tweetConverter.castResultsetToTweets(events);
    return Promise.resolve(tweets);
  }
}