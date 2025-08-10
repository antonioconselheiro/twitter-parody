import { Injectable } from "@angular/core";
import { HexString } from "@belomonte/nostr-ngx";
import { AccountViewModelProxy } from "@shared/view-model-mapper/account-view-model.proxy";
import { FeedMapper } from "@shared/view-model-mapper/feed.mapper";
import { FeedViewModel } from "@view-model/feed.view-model";
import { NoteViewModel } from "@view-model/note.view-model";
import { FeedNostr } from "./feed.nostr";
import { FeedProxy } from "./feed.proxy";
import { TweetNostr } from "./tweet.nostr";
import { nip19 } from "nostr-tools";

@Injectable({
  providedIn: 'root'
})
export class TweetProxy  extends FeedProxy {

  constructor(
    private tweetNostr: TweetNostr,
    protected accountViewModelProxy: AccountViewModelProxy,
    protected feedMapper: FeedMapper,
    protected feedNostr: FeedNostr
  ) {
    super();
  }

  loadTweet(event: HexString): Promise<NoteViewModel | null> {
    const t = nip19.decode(event);
    debugger;
    return this.tweetNostr
      .loadTweet(event)
      .then(event => this.feedMapper.toViewModel(event));
  }

  loadFeedUntilTweet(pubkey: HexString, event: HexString): Promise<FeedViewModel> {
    return this.tweetNostr
      .loadFeedUntilTweet(pubkey, event)
      .then(events => this.feedMapper.toViewModel(events));
  }
}
