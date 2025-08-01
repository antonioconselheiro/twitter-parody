import { Injectable } from '@angular/core';
import { AccountViewModelProxy } from '@shared/view-model-mapper/account-view-model.proxy';
import { FeedMapper } from '@shared/view-model-mapper/feed.mapper';
import { FeedViewModel } from '@view-model/feed.view-model';
import { Filter, NostrEvent } from 'nostr-tools';
import { Observable, Subject } from 'rxjs';
import { FeedNostr } from './feed.nostr';

@Injectable({
  providedIn: 'root'
})
export class FeedProxy {

  constructor(
    private accountViewModelProxy: AccountViewModelProxy,
    private feedMapper: FeedMapper,
    private feedNostr: FeedNostr
  ) { }

  /**
   * Load events related to events from list given as argument.
   * This will load replies, repost, reactions and zaps.
   */
  async loadFeedRelatedContent(feed: FeedViewModel): Promise<FeedViewModel> {
    const eventIdList = feed.toEventIdArray();
    const interactions = await this.feedNostr.loadRelatedContent(eventIdList);

    return this.feedMapper.indexViewModel(feed, interactions);
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
  loadFeed(filter: Omit<Filter, 'limit'>, pageSize = 10): Observable<FeedViewModel> {
    const subject = new Subject<FeedViewModel>();
    void this.loadFeedPage(filter, pageSize, subject)
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
  loadFeedNextPage(filter: Omit<Filter, 'limit'>, olderNote: NostrEvent, pageSize?: number): Promise<FeedViewModel>;

  /**
   * Loads the next page relative to a user's timeline or a user's event, the event
   * will be considered the oldest event and the next page will be load after it
   * @param pubkey, chosen user's pubkey
   * @param timeline, the whole timeline to extract the older nostr event
   * @param pageSize, notes per page, default to 10
   */
  loadFeedNextPage(filter: Omit<Filter, 'limit'>, timeline: FeedViewModel, pageSize?: number): Promise<FeedViewModel>;

  /**
   * Loads the next page relative to a user's timeline or a user's event, the event
   * will be considered the oldest event and the next page will be load after it
   * @param pubkey, chosen user's pubkey
   * @param olderNoteOrTimeline, the older nostr event from the timeline or the whole timeline to extract the older nostr event
   * @param pageSize, notes per page, default to 10
   */
  loadFeedNextPage(filter: Omit<Filter, 'limit'>, olderNoteOrTimeline: FeedViewModel | NostrEvent, pageSize?: number): Promise<FeedViewModel>;
  loadFeedNextPage(filter: Omit<Filter, 'limit'>, olderNoteOrTimeline: FeedViewModel | NostrEvent, pageSize = 10): Promise<FeedViewModel> {
    let olderNote: NostrEvent | undefined;
    if (olderNoteOrTimeline instanceof FeedViewModel) {
      olderNote = this.getOlderEvent(olderNoteOrTimeline);
    } else {
      olderNote = olderNoteOrTimeline;
    }

    if (!olderNote) {
      return this.loadFeedPage(filter, pageSize);
    }

    return this.loadFeedPage(filter, pageSize, olderNote.created_at);
  }

  /**
   * load a specific page from pubkey publications
   *
   * @param pubkey, chosen user's pubkey
   * @param pageSize, notes per page, default to 10
   * @param olderEventCreatedAt, optional created_at property from the older event from the feed, the events will be loaded since this time
   * @returns the requested page
   */
  async loadFeedPage(
    filter: Omit<Filter, 'limit'>,
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
  async loadFeedPage(
    filter: Omit<Filter, 'limit'>,
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
  async loadFeedPage(
    filter: Omit<Filter, 'limit'>,
    pageSize?: number,
    subject?: Subject<FeedViewModel>,
    olderEventCreatedAt?: number
  ): Promise<FeedViewModel>;

  async loadFeedPage(
    filter: Omit<Filter, 'limit'>,
    pageSize?: number,
    subject?: Subject<FeedViewModel> | number,
    olderEventCreatedAt?: number
  ): Promise<FeedViewModel>;

  async loadFeedPage(
    filter: Omit<Filter, 'limit'>,
    pageSize?: number,
    subject?: Subject<FeedViewModel> | number,
    olderEventCreatedAt?: number
  ): Promise<FeedViewModel> {
    const mainNotes = await this.feedNostr.listTweets(filter, pageSize, olderEventCreatedAt);
    let feed = await this.feedMapper.toViewModel(mainNotes);
    await this.accountViewModelProxy.loadViewModelAccounts(feed);

    //  fix 'subject' variable name to 'olderEventCreatedAt' to help method signature overiding
    if (typeof subject === 'number') {
      olderEventCreatedAt = subject;
      subject = undefined;
    }

    feed = await this.loadFeedRelatedContent(feed);
    if (subject) {
      subject.next(feed);
    }

    return Promise.resolve(feed);
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
    const olderEvent = feed.toEventArray()
      .reduce((event1, event2) => event2.created_at > event1.created_at ? event1 : event2);

    return olderEvent || undefined;
  }
}
