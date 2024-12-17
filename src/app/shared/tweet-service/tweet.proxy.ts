import { Injectable } from "@angular/core";
import { NostrEvent } from "@belomonte/nostr-ngx";
import { FeedMapper } from "@shared/view-model-mapper/feed.mapper";
import { RepostMapper } from "@shared/view-model-mapper/repost.mapper";
import { FeedViewModel } from "@view-model/feed.view-model";
import { NoteViewModel } from "@view-model/note.view-model";
import { Repost, ShortTextNote } from 'nostr-tools/kinds';
import { from, mergeMap, Observable, Subject } from "rxjs";
import { TweetNostr } from "./tweet.nostr";

@Injectable({
  providedIn: 'root'
})
export class TweetProxy {

  constructor(
    private repostMapper: RepostMapper,
    private tweetNostr: TweetNostr,
    private feedMapper: FeedMapper
  ) { }

  listTweetsFromPubkey(pubkey: string): Observable<FeedViewModel> {
    const subject = new Subject<FeedViewModel>();
    this.tweetNostr
      .listUserNotes(pubkey)
      .then(mainNotes => {
        this.feedMapper
          .toViewModel(mainNotes)
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
    const events = [...feed].map(viewModel => viewModel.id);
    const interactions = await this.tweetNostr.loadRelatedContent(events);
    return this.feedMapper.patchViewModel(feed, interactions);
  }

  //  FIXME: repensando agora, este método faz sentido? talvéz eu deva escutar sempre o feed e nunca um evento isolado
  //  pode parecer útil, mas não tem valor prático
  /**
   * Subscribe into an event to listen updates about reposts, reactions and zaps
   */
  listenNoteInteraction(note: NostrEvent<ShortTextNote | Repost>, mostRecentEvent?: NostrEvent): Observable<NoteViewModel> {
    return from(this.repostMapper.toViewModel(note)).pipe(
      mergeMap((noteView: NoteViewModel) =>
        this.tweetNostr
          .listenNoteInteractions(note, mostRecentEvent)
          .pipe(mergeMap(event => from(
            (async () => this.repostMapper.patchViewModel(noteView, [event]))()
          )))
      )
    );
  }
}
