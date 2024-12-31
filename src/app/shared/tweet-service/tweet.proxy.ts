import { Injectable } from "@angular/core";
import { NostrEvent } from "@belomonte/nostr-ngx";
import { FeedMapper } from "@shared/view-model-mapper/feed.mapper";
import { FeedViewModel } from "@view-model/feed.view-model";
import { from, mergeMap, Observable, Subject } from "rxjs";
import { TweetNostr } from "./tweet.nostr";
import { SortedNostrViewModelSet } from "@view-model/sorted-nostr-view-model.set";
import { NoteViewModel } from "@view-model/note.view-model";

@Injectable({
  providedIn: 'root'
})
export class TweetProxy {

  constructor(
    private tweetNostr: TweetNostr,
    private feedMapper: FeedMapper
  ) { }

  feedFromPubkey(pubkey: string): Observable<FeedViewModel> {
    const subject = new Subject<FeedViewModel>();
    this.tweetNostr
      .listUserNotes(pubkey)
      .then(mainNotes => {

        /**
         * TODO: TODOING:
         * 1. view model do feed mapper não pode carregar informações, como o nip05,
         * isso deve vir antes, o view model deve pressupor que todas as informações
         * necessárias já estão carregadas e disponíveis no cache;
         * 
         * 
         */
        this.feedMapper
          .toViewModel(mainNotes.splice(0, 3))
          .then(feed => {
            subject.next(feed);
            this.loadFeedRelatedContent(feed)
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
      .pipe(mergeMap(events => from(this.feedMapper.patchViewModel(feed, events))));
  }

  private getMostRecentEvent(eventList: Array<NostrEvent>): NostrEvent {
    return eventList.reduce((maisRecente, atual) => atual.created_at > maisRecente.created_at ? atual : maisRecente);
  }
}
