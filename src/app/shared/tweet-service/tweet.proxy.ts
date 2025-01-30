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

  /**
   * loads a page of notes written by a chosen user.
   * emits the data three times, each time with more updates if available.
   * 
   * First emits all notes from request with accounts data included.
   * Second emits 
   *
   * @param pubkey, chosen user's pubkey
   * @param pageSize, notes per page, default to 10
   *
   * @returns list of notes cast into view model
   */
  loadTimeline(pubkey: HexString, pageSize = 10): Observable<FeedViewModel> {
    const subject = new Subject<FeedViewModel>();
    void this.loadTimelinePageFromPubkey(pubkey, pageSize, subject)
      .then(() => subject.complete());

    return subject.asObservable();
  }

  /**
   * Loads the next page relative to a user's timeline or a user's event, the event
   * will be considered the oldest event and the next page will be load after it
   * @param pubkey, chosen user's pubkey
   * @param olderNote, the older nostr event from the timeline
   * @param pageSize, notes per page, default to 10
   */
  loadTimelineNextPage(pubkey: HexString, olderNote: NostrEvent, pageSize?: number): Promise<FeedViewModel>;

  /**
   * Loads the next page relative to a user's timeline or a user's event, the event
   * will be considered the oldest event and the next page will be load after it
   * @param pubkey, chosen user's pubkey
   * @param timeline, the whole timeline to extract the older nostr event
   * @param pageSize, notes per page, default to 10
   */
  loadTimelineNextPage(pubkey: HexString, timeline: FeedViewModel, pageSize?: number): Promise<FeedViewModel>;

  /**
   * Loads the next page relative to a user's timeline or a user's event, the event
   * will be considered the oldest event and the next page will be load after it
   * @param pubkey, chosen user's pubkey
   * @param olderNoteOrTimeline, the older nostr event from the timeline or the whole timeline to extract the older nostr event
   * @param pageSize, notes per page, default to 10
   */
  loadTimelineNextPage(pubkey: HexString, olderNoteOrTimeline: FeedViewModel | NostrEvent, pageSize?: number): Promise<FeedViewModel>;
  loadTimelineNextPage(pubkey: HexString, olderNoteOrTimeline: FeedViewModel | NostrEvent, pageSize = 10): Promise<FeedViewModel> {
    let olderNote: NostrEvent | undefined;
    if (olderNoteOrTimeline instanceof SortedNostrViewModelSet) {
      olderNote = this.getOlderEvent(olderNoteOrTimeline);
    } else {
      olderNote = olderNoteOrTimeline;
    }

    if (!olderNote) {
      return this.loadTimelinePageFromPubkey(pubkey, pageSize);
    }

    return this.loadTimelinePageFromPubkey(pubkey, pageSize, olderNote.created_at);
  }

  /**
   * load a specific page from pubkey publications
   *
   * @param pubkey, chosen user's pubkey
   * @param pageSize, notes per page, default to 10
   * @param olderEventCreatedAt, optional created_at property from the older event from the feed, the events will be loaded since this time
   * @returns the requested page
   */
  async loadTimelinePageFromPubkey(
    pubkey: HexString,
    pageSize?: number,
    olderEventCreatedAt?: number
  ): Promise<FeedViewModel>;

  /**
   * load a specific page from pubkey publications
   *
   * @param pubkey, chosen user's pubkey
   * @param pageSize, notes per page, default to 10
   * @param subject, optional Subject to emit events while they are loading () 
   * @returns the requested page
   */
  async loadTimelinePageFromPubkey(
    pubkey: HexString,
    pageSize?: number,
    subject?: Subject<FeedViewModel>
  ): Promise<FeedViewModel>;

  /**
   * load a specific page from pubkey publications
   *
   * @param pubkey, chosen user's pubkey
   * @param pageSize, notes per page, default to 10
   * @param subject, optional Subject to emit events while they are loading () 
   * @param olderEventCreatedAt, optional created_at property from the older event from the feed, the events will be loaded since this time
   * @returns the requested page
   */
  async loadTimelinePageFromPubkey(
    pubkey: HexString,
    pageSize?: number,
    subject?: Subject<FeedViewModel>,
    olderEventCreatedAt?: number
  ): Promise<FeedViewModel>;

  async loadTimelinePageFromPubkey(
    pubkey: HexString,
    pageSize?: number,
    subject?: Subject<FeedViewModel> | number,
    olderEventCreatedAt?: number
  ): Promise<FeedViewModel> {
    const mainNotes = await this.tweetNostr.listUserNotes(pubkey, pageSize, olderEventCreatedAt);
    let feed = await this.feedMapper.toViewModel(mainNotes);
    await this.accountViewModelProxy.loadViewModelAccounts(feed);

    if (typeof subject === 'number') {
      olderEventCreatedAt = subject;
      subject = undefined;
    }

    feed = await this.feedMapper.toViewModel(mainNotes);
    if (subject) {
      subject.next(feed);
    }

    feed = await this.loadFeedRelatedContent(feed);
    if (subject) {
      subject.next(feed);
    }

    return Promise.resolve(feed);
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
   * Subscribe to listen updates about reposts, reactions and zaps of a feed (group of notes)
   * @param feed, listen updates from events on this feed
   */
  listenTimelineUpdates(feed: FeedViewModel): Observable<FeedViewModel> {
    const eventList = [...feed].map(note => note.event);
    const latestEvent = this.getLatestEvent(eventList);

    return this.tweetNostr
      .listenTimelineUpdates(eventList, latestEvent)
      .pipe(map(events => this.feedMapper.patchViewModel(feed, events)));
  }

  /**
   * return the newer event into a given list
   * @returns the newer event in the list or undefined if the list has no items
   */
  getLatestEvent(eventList: Array<NostrEvent>): NostrEvent | undefined {
    return eventList.reduce((event1, event2) => event2.created_at > event1.created_at ? event2 : event1);
  }

  /**
   * return the older event into a given list
   * @returns the older event in the list or undefined if the list has no items
   */
  getOlderEvent(feed: FeedViewModel): NostrEvent | undefined {
    return [...feed]
      .map(view => view.event)
      .reduce((event1, event2) => event2.created_at > event1.created_at ? event1 : event2);
  }
}
