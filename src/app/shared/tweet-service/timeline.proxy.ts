import { Injectable } from "@angular/core";
import { HexString, NostrEvent } from "@belomonte/nostr-ngx";
import { AccountViewModelProxy } from "@shared/view-model-mapper/account-view-model.proxy";
import { FeedMapper } from "@shared/view-model-mapper/feed.mapper";
import { FeedViewModel } from "@view-model/feed.view-model";
import { Repost, ShortTextNote } from 'nostr-tools/kinds';
import { map, Observable, Subject } from "rxjs";
import { FeedNostr } from "./feed.nostr";
import { FeedProxy } from "./feed.proxy";

@Injectable({
  providedIn: 'root'
})
export class TimelineProxy extends FeedProxy {

  constructor(
    protected accountViewModelProxy: AccountViewModelProxy,
    protected feedMapper: FeedMapper,
    protected feedNostr: FeedNostr
  ) {
    super();
  }

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
    return this.loadFeedNextPage({
      kinds: [
        ShortTextNote,
        Repost
      ],
      authors: [
        pubkey
      ]
    }, olderNoteOrTimeline, pageSize);
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
    return this.loadFeedPage({
      kinds: [
        ShortTextNote,
        Repost
      ],
      authors: [
        pubkey
      ]
    }, pageSize, subject, olderEventCreatedAt);
  }

  /**
   * Subscribe to listen updates about reposts, reactions and zaps of a feed (group of notes)
   * @param feed, listen updates from events on this feed
   */
  listenTimelineUpdates(feed: FeedViewModel): Observable<FeedViewModel> {
    const eventList = feed.toEventArray();
    const latestEvent = this.getLatestEvent(eventList);

    return this.feedNostr
      .listenFeedUpdates(eventList, latestEvent)
      .pipe(map(events => this.feedMapper.patchViewModel(feed, events)));
  }
}
