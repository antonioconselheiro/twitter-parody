import { Injectable } from "@angular/core";
import { AccountViewModelProxy, FeedMapper, FeedViewModel, HexString, NoteViewModel } from "@belomonte/nostr-ngx";
import { FeedNostr } from "./feed.nostr";
import { FeedProxy } from "./feed.proxy";
import { TweetNostr } from "./tweet.nostr";

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
