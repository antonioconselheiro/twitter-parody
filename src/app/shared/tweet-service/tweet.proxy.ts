import { Injectable } from "@angular/core";
import { HexString, NostrEvent } from "@belomonte/nostr-ngx";
import { FeedMapper } from "@shared/view-model-mapper/feed.mapper";
import { FeedViewModel } from "@view-model/feed.view-model";
import { NoteViewModel } from "@view-model/note.view-model";
import { SortedNostrViewModelSet } from "@view-model/sorted-nostr-view-model.set";
import { from, mergeMap, Observable, Subject } from "rxjs";
import { TweetNostr } from "./tweet.nostr";
serviço que carrega cada view model destinado para cada tela com todas as informações necessárias,
  deve ser o proxy que deve assumir essa responsabilidade ? sim, mas talvéz essa lógica deve ser agrupada
em um outro serviço independnete somente para carregamento de contas de acordo com a necessidade.

Tipos de carregamento da conta:
-> nenhuma conta é carregada, dados são somente carregados do cache;
 -> somente um pequeno conjunto de contas é carregado, geralmente por que serão as primeiras a serem exibidas em tela;
-> todas as contas são carregadas até o nível definido por parâmetro.

Vou precisar incluir um flyweight para que controle o carregamento das imagens associadas as contas afim de evitar replicação dos dados convertidos para base64

@Injectable({
  providedIn: 'root'
})
export class TweetProxy {

  constructor(
    private tweetNostr: TweetNostr,
    private feedMapper: FeedMapper
  ) { }

  feedFromPubkey(pubkey: HexString): Observable<FeedViewModel> {
    const subject = new Subject<FeedViewModel>();
    this.asyncFeedFromPubkey(pubkey, subject)
      .then(() => subject.complete());

    return subject.asObservable();
  }

  private async asyncFeedFromPubkey(pubkey: HexString, subject: Subject<FeedViewModel>): Promise<void> {
    const mainNotes = await this.tweetNostr.listUserNotes(pubkey);
    await this.tweetNostr.loadAccountsForInitialViewport(mainNotes, {
      amountToLoad: 7
    });
    let feed = await this.feedMapper.toViewModel(mainNotes);
    subject.next(feed);

    feed = await this.loadFeedRelatedContent(feed);
    subject.next(feed);

    await this.tweetNostr.loadViewModelAccounts(feed);
    feed = await this.feedMapper.toViewModel(mainNotes);
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
      .pipe(mergeMap(events => from(this.feedMapper.patchViewModel(feed, events))));
  }

  private getMostRecentEvent(eventList: Array<NostrEvent>): NostrEvent {
    return eventList.reduce((maisRecente, atual) => atual.created_at > maisRecente.created_at ? atual : maisRecente);
  }
}
