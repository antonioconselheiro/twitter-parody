import { HexString, NostrEvent } from '@belomonte/nostr-ngx';
import { LazyNoteViewModel } from './lazy-note.view-model';
import { NostrEventIdViewModel } from './nostr-event-id.view-model';
import { NostrEventViewModel } from './nostr-event.view-model';
import { RelatedContentViewModel } from './related-content.view-model';

/**
 * Set of ready to render nostr data.
 * Data is added in correct position, sorted by event created timestamp.
 */
export class NostrViewModelSet<
  MainViewModel extends IndexableViewModel,
  IndexableViewModel extends NostrEventIdViewModel | NostrEventViewModel = MainViewModel
> {

  /**
   * here are available only the events that must be rendered with
   * the ids arranged in order from newest event to oldest
   */
  protected sortedView = new Array<HexString>();

  /**
   * Here is added every event related to the collection
   */
  protected indexed: { [id: HexString]: RelatedContentViewModel<IndexableViewModel> } = {};

  /**
   * To avoid a loop to each iteration, indexed content is sorted in
   * this list each time a new view model is added, allowing iterator
   * look to this property in the set when a iteration is running
   */
  protected iterable: Array<RelatedContentViewModel<MainViewModel>> = [];

  constructor(values?: readonly MainViewModel[] | null) {
    if (values) {
      values.forEach(value => this.add(value));
    }
  }

  toEventArray(): Array<NostrEvent> {
    return this
      .toArray()
      .map(related => 'event' in related.viewModel ? related.viewModel.event : null)
      .filter((e: NostrEvent | null): e is NostrEvent => !!e);
  }

  toEventIdArray(): Array<HexString> {
    return this
      .toEventArray()
      .map(event => event.id)
  }

  toArray(): Array<RelatedContentViewModel<MainViewModel>> {
    return [...this];
  }

  [Symbol.iterator](): IterableIterator<RelatedContentViewModel<MainViewModel>> {
    return this.iterable[Symbol.iterator]();
  }

  /**
   * will include view model to be displayed 
   */
  add(value: MainViewModel): this {
    this.index(value);
    this.addOrderly(value);
    this.syncIterable();
    return this;
  }

  /**
   * Must return negative if A comes before B,
   * must return positive if B comes before A,
   * and 0 if they are equal.
   * 
   * This implementation sort from the newer first to the older last.
   *
   * @param a 
   * @param b 
   */
  protected sortingRule(a: MainViewModel, b: MainViewModel): number {
    return b.createdAt - a.createdAt;
  }

  protected addOrderly(value: MainViewModel): void {
    const index = this.findIndexForViewModel(value);
    //  insere id na lista no index correto
    this.sortedView.splice(index, 0, value.id);
  }

  private findIndexForViewModel(viewModel: MainViewModel, sortedView?: Array<HexString>): number {
    const middle = 2;
    sortedView = sortedView || this.sortedView;

    if (sortedView.length === 0) {
      return 0;
    } else if (sortedView.length === 1) {
      const onlyViewModel = this.indexed[sortedView[0]].viewModel as MainViewModel;
      const result = this.sortingRule(viewModel, onlyViewModel);
      return result < 0 ? 0 : 1;
    }

    const middleIndex = Math.ceil(sortedView.length / middle);
    const middleViewModel = this.indexed[this.sortedView[middleIndex]];
    const decision = this.sortingRule(viewModel, middleViewModel.viewModel as MainViewModel);

    if (decision === 0) {
      return middleIndex;
    }

    const listClone = new Array<string>().concat(sortedView);
    if (decision > 0) { // positive, A goes after B
      return this.findIndexForViewModel(viewModel, listClone.splice(0, middleIndex)) + middleIndex;
    } else { // negative, A goes before B
      return this.findIndexForViewModel(viewModel, listClone.splice(middleIndex));
    }
  }

  /**
   * Syncronize sorted view into each collection addition or remotion to avoid need to sync to each loop
   */
  protected syncIterable(): void {
    this.iterable = this.sortedView.map(id => this.indexed[id]).filter((viewing): viewing is RelatedContentViewModel<MainViewModel> => this.isMain(viewing.viewModel));
  }

  /**
   * this method will index the event, or merge if it already
   * exists, and relate to other events in the feed
   */
  index(value: IndexableViewModel): RelatedContentViewModel<IndexableViewModel> {
    let relatedContent = this.indexed[value.id];

    if (relatedContent) {
      if (!('event' in relatedContent.viewModel)) {
        relatedContent.viewModel = value;
      }
    } else {
      relatedContent = this.factoryRelatedContentFromViewModel(value);
    }

    this.indexed[value.id] = relatedContent;
    return relatedContent;
  }

  indexEvents(list: Array<IndexableViewModel>): void {
    list.forEach(value => this.index(value));
  }

  protected isMain(viewModel: MainViewModel | IndexableViewModel): viewModel is MainViewModel {
    return this.isIndexable(viewModel);
  }

  protected isIndexable(viewModel: MainViewModel | IndexableViewModel): viewModel is IndexableViewModel {
    return 'id' in viewModel && 'createdAt' in viewModel;
  }

  get(eventId: HexString): RelatedContentViewModel<IndexableViewModel> | undefined {
    return this.indexed[eventId];
  }

  delete(value: MainViewModel): boolean {
    const indexNotFound = -1;
    const index = this.sortedView.indexOf(value.id);

    if (index !== indexNotFound) {
      this.sortedView.splice(index, 1);
      delete this.indexed[value.id];
      return true;
    }

    return false;
  }

  clear(): void {
    this.sortedView = [];
    this.indexed = {};
    this.iterable = [];
  }

  values(): IterableIterator<RelatedContentViewModel<MainViewModel>> {
    return this.iterable.values();
  }

  forEach(callbackfn: (value: RelatedContentViewModel<MainViewModel>, index: number, array: RelatedContentViewModel<MainViewModel>[]) => void, thisArg?: unknown): void {
    const me = thisArg || this;
    this
      .toArray()
      .forEach((value, index, arr) => callbackfn.call(me, value, index, arr));
  }

  concat(concat: NostrViewModelSet<MainViewModel>): NostrViewModelSet<MainViewModel> {
    const clone = concat.clone();
    //  FIXME: isso obrigará o array de clone recriar todos os objetos de relacionamento da coleção anterior
    //  Se de alguma maneira os objetos de relacionamento forem clonados e preservados e alimentados, ao invés
    //  de recriados, então será evitada reexecução de boa quantidade de lógica a cada clonagem
    this.toArray().forEach(item => clone.add(item.viewModel));
    return clone;
  }

  clone(): NostrViewModelSet<MainViewModel, IndexableViewModel> {
    const generic = new NostrViewModelSet<MainViewModel, IndexableViewModel>();

    generic.sortedView = (new Array<string>()).concat(this.sortedView);
    generic.indexed = { ...this.indexed };
    generic.iterable = (new Array<RelatedContentViewModel<MainViewModel>>()).concat(this.iterable);

    return generic;
  }

  protected factoryRelatedContentFromViewModel(viewModel: IndexableViewModel): RelatedContentViewModel<IndexableViewModel> {
    return {
      reactions: {},
      reactionsAuthors: [],
      zaps: new Set(),
      zapAuthors: [],
      reposted: new Set(),
      repostedAuthors: [],
      repliedBy: new Set(),
      repliedByAuthors: [],
      viewModel
    };
  }

  protected factoryRelatedContentFromHexadecimal(id: HexString): RelatedContentViewModel<LazyNoteViewModel> {
    return {
      reactions: {},
      reactionsAuthors: [],
      zaps: new Set(),
      zapAuthors: [],
      reposted: new Set(),
      repostedAuthors: [],
      repliedBy: new Set(),
      repliedByAuthors: [],
      viewModel: {
        id,
        type: 'lazy',
        author: null,
        event: null,
        origin: [],
        content: undefined,
        media: undefined,
        location: undefined,
        createdAt: -Infinity,
        relates: []
      }
    };
  }

  get size(): number {
    return this.sortedView.length;
  }
}
