import { Injectable } from "@angular/core";
import { HexString } from "@belomonte/nostr-ngx";
import { FeedMapper } from "@shared/view-model-mapper/feed.mapper";
import { NoteViewModel } from "@view-model/note.view-model";
import { TweetNostr } from "./tweet.nostr";

@Injectable({
  providedIn: 'root'
})
export class TweetProxy {

  constructor(
    private tweetNostr: TweetNostr,
    private feedMapper: FeedMapper
  ) { }

  loadTweet(event: HexString): Promise<NoteViewModel | null> {
    return this.tweetNostr
      .loadTweet(event)
      .then(event => this.feedMapper.toViewModel(event));
  }


}
