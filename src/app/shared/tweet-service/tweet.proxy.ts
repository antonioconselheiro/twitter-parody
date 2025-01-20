import { Injectable } from "@angular/core";
import { AccountRenderable, HexString, NostrEvent } from "@belomonte/nostr-ngx";
import { AccountViewModelProxy } from "@shared/view-model-mapper/account-view-model.proxy";
import { FeedMapper } from "@shared/view-model-mapper/feed.mapper";
import { FeedViewModel } from "@view-model/feed.view-model";
import { NoteViewModel } from "@view-model/note.view-model";
import { SortedNostrViewModelSet } from "@view-model/sorted-nostr-view-model.set";
import { map, Observable, Subject } from "rxjs";
import { TweetNostr } from "./tweet.nostr";

@Injectable({
  providedIn: 'root'
})
export class TweetProxy {

  constructor(
    private accountViewModelProxy: AccountViewModelProxy,
    private tweetNostr: TweetNostr,
    private feedMapper: FeedMapper
  ) { }

  feedFromPubkey(pubkey: HexString): Observable<FeedViewModel<AccountRenderable>> {
    const subject = new Subject<FeedViewModel<AccountRenderable>>();
    void this.asyncFeedFromPubkey(pubkey, subject)
      .then(() => subject.complete());

    return subject.asObservable();
  }

  private async asyncFeedFromPubkey(pubkey: HexString, subject: Subject<FeedViewModel<AccountRenderable>>): Promise<void> {
    const mainNotes = await this.tweetNostr.listUserNotes(pubkey);
    let feed = await this.feedMapper.toViewModel(mainNotes);
    await this.accountViewModelProxy.loadViewModelAccounts(feed);

    feed = await this.feedMapper.toViewModel(mainNotes);
    subject.next(feed);

    feed = await this.loadFeedRelatedContent(feed);
    subject.next(feed);
  }

  /**
   * Load events related to events from list given as argument.
   * This will load replies, repost, reactions and zaps.
   */
  async loadFeedRelatedContent(feed: FeedViewModel): Promise<FeedViewModel> {
    const eventList = [...feed];
    const events = eventList.map(viewModel => viewModel.id);
    const interactions = await this.tweetNostr.loadRelatedContent(events);

    return this.feedMapper.patchViewModel(new SortedNostrViewModelSet<NoteViewModel>(eventList), interactions);
  }

  /**
   * Subscribe into an event to listen updates about reposts, reactions and zaps
   */
  listenFeed(feed: FeedViewModel, mostRecentEvent?: NostrEvent): Observable<FeedViewModel> {
    const eventList = [...feed].map(note => note.event);
    if (!mostRecentEvent) {
      mostRecentEvent = this.getMostRecentEvent(eventList);
    }

    return this.tweetNostr
      .listenFeedUpdates(eventList, mostRecentEvent)
      .pipe(map(events => this.feedMapper.patchViewModel(feed, events)));
  }

  private getMostRecentEvent(eventList: Array<NostrEvent>): NostrEvent {
    return eventList.reduce((maisRecente, atual) => atual.created_at > maisRecente.created_at ? atual : maisRecente);
  }
}
