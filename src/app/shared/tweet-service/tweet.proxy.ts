import { Injectable } from "@angular/core";
import { NostrEvent } from "@belomonte/nostr-ngx";
import { FeedMapper } from "@shared/view-model-mapper/feed.mapper";
import { FeedAggregator } from "@view-model/feed-aggregator.interface";
import { NoteViewModel } from "@view-model/note.view-model";
import { Observable, Subject } from "rxjs";
import { TweetNostr } from "./tweet.nostr";

@Injectable({
  providedIn: 'root'
})
export class TweetProxy {

  constructor(
    private tweetNostr: TweetNostr,
    private feedMapper: FeedMapper
  ) { }

  listTweetsFromPubkey(pubkey: string): Observable<FeedAggregator> {
    const subject = new Subject<FeedAggregator>();
    this.tweetNostr
      .listUserNotes(pubkey)
      .then(mainNotes => {
        this.feedMapper
          .toViewModel(mainNotes)
          .then(feed => {
            subject.next(feed);

            this.loadFeedRelatedContent(mainNotes)
              .then(feedWithRelatedContentLoaded => {
                subject.next(feedWithRelatedContentLoaded);
                subject.complete();
              })
              .catch(e => subject.error(e));
          })
          .catch(e => subject.error(e));
      }).catch(e => subject.error(e));

    return subject.asObservable();
  }

  /**
   * Load events related to events from list given as argument.
   * This will load replies, repost, reactions and zaps.
   */
  async loadFeedRelatedContent(feed: FeedAggregator): Promise<FeedAggregator> {
    const events = [...feed.feed].map(viewModel => viewModel.id);
    const interactions = await this.tweetNostr.loadRelatedContent(events);
    return this.feedMapper.toViewModel(feed, interactions);
  }

  /**
   * Subscribe into an event to listen updates about reposts, reactions and zaps
   */
  listenNoteInteraction(note: NostrEvent): Observable<NoteViewModel> {

  }
}
