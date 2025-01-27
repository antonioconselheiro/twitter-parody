import { Injectable } from "@angular/core";
import { HexString, NostrEvent } from "@belomonte/nostr-ngx";
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

  loadFullFeedFromPubkey(pubkey: HexString, pageSize = 10): Observable<FeedViewModel> {
    const subject = new Subject<FeedViewModel>();
    void this.asyncLoadFeedPageFromPubkey(pubkey, subject, pageSize)
      .then(() => subject.complete());

    return subject.asObservable();
  }

  private async asyncLoadFeedPageFromPubkey(pubkey: HexString, subject: Subject<FeedViewModel>, pageSize = 10, olderEventCreatedAt?: number): Promise<void> {
    const mainNotes = await this.tweetNostr.listUserNotes(pubkey, pageSize, olderEventCreatedAt);
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
    const eventIdList = eventList.map(viewModel => viewModel.id);
    const interactions = await this.tweetNostr.loadRelatedContent(eventIdList);

    return this.feedMapper.patchViewModel(new SortedNostrViewModelSet<NoteViewModel>(eventList), interactions);
  }

  /**
   * Subscribe into an event to listen updates about reposts, reactions and zaps
   */
  listenFeedUpdates(feed: FeedViewModel, latestEvent?: NostrEvent): Observable<FeedViewModel> {
    const eventList = [...feed].map(note => note.event);
    if (!latestEvent) {
      latestEvent = this.getLatestEvent(eventList);
    }

    return this.tweetNostr
      .listenFeedUpdates(eventList, latestEvent)
      .pipe(map(events => this.feedMapper.patchViewModel(feed, events)));
  }

  /**
   * return the newer event into a given list
   * @returns the newer event in the list or undefined if the list has no items
   */
  private getLatestEvent(eventList: Array<NostrEvent>): NostrEvent | undefined {
    return eventList.reduce((event1, event2) => event2.created_at > event1.created_at ? event2 : event1);
  }

  /**
   * return the older event into a given list
   * @returns the older event in the list or undefined if the list has no items
   */
  private getOlderEvent(feed: FeedViewModel): NostrEvent | undefined {
    return [...feed]
      .map(view => view.event)
      .reduce((event1, event2) => event2.created_at > event1.created_at ? event1 : event2);
  }
}
