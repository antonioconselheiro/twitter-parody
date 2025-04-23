import { HexString, NostrEvent } from '@belomonte/nostr-ngx';
import { NostrEventIdViewModel } from './nostr-event-id.view-model';
import { NostrEventViewModel } from './nostr-event.view-model';
import { RelatedContentViewModel } from './related-content.view-model';
import { LazyNoteViewModel } from './lazy-note.view-model';

/**
 * Set of ready to render nostr data.
 * Data is added in correct position, sorted by event created timestamp.
 */
export class NostrViewModelSet<GenericViewModel extends NostrEventIdViewModel | NostrEventViewModel> {

  /**
   * here are available only the events that must be rendered with
   * the ids arranged in order from newest event to oldest
   */
  protected sortedDisplay = new Array<HexString>();

  /**
   * Here is added every event related to the collection
   */
  protected indexed: { [id: HexString]: RelatedContentViewModel<GenericViewModel> } = {};

  /**
   * To avoid a loop to each iteration, indexed content is sorted in
   * this list each time a new view model is added, allowing iterator
   * look to this property in the set when a iteration is running
   */
  protected iterable: Array<RelatedContentViewModel<GenericViewModel>> = [];

  constructor(values?: readonly GenericViewModel[] | null) {
    if (values) {
      values.forEach(value => this.add(value));
    }
  }

  toEventList(): Array<NostrEvent> {
    return this
      .toArray()
      .map(related => 'event' in related.viewModel ? related.viewModel.event : null)
      .filter((e: NostrEvent | null): e is NostrEvent => !!e);
  }

  toArray(): Array<RelatedContentViewModel<GenericViewModel>> {
    return [...this];
  }

  [Symbol.iterator](): IterableIterator<RelatedContentViewModel<GenericViewModel>> {
    return this.iterable[Symbol.iterator]();
  }

  /**
   * will include view model to be displayed 
   */
  add(value: GenericViewModel): this {
    this.indexEvent(value);
    const indexNotFound = -1;
    const index = this.sortedDisplay.findIndex(id => this.indexed[id].viewModel.createdAt < value.createdAt);
    if (index === indexNotFound) {
      this.sortedDisplay.push(value.id);
    } else {
      this.sortedDisplay.splice(index, 0, value.id);
    }

    this.iterable = this.sortedDisplay.map(id => this.indexed[id]);
    return this;
  }

  /**
   * this method will index the event, or merge if it already
   * exists, and relate to other events in the feed
   */
  indexEvent(value: GenericViewModel): void {
    let relatedContent = this.indexed[value.id];

    if (relatedContent) {
      if (!('event' in relatedContent.viewModel)) {
        relatedContent.viewModel = value;
      }
    } else {
      relatedContent = this.factoryRelatedContentFromViewModel(value);
    }
  }

  indexEvents(list: Array<GenericViewModel>): void {
    list.forEach(value => this.indexEvent(value));
  }

  get(eventId: HexString): GenericViewModel | undefined {
    return this.indexed[eventId].viewModel;
  }

  delete(value: GenericViewModel): boolean {
    const indexNotFound = -1;
    const index = this.sortedDisplay.indexOf(value.id);

    if (index !== indexNotFound) {
      this.sortedDisplay.splice(index, 1);
      delete this.indexed[value.id];
      return true;
    }

    return false;
  }

  clear(): void {
    this.sortedDisplay = [];
    this.indexed = {};
    this.iterable = [];
  }

  values(): IterableIterator<GenericViewModel> {
    return this.sortedDisplay.map(id => this.indexed[id].viewModel).values();
  }

  forEach(callbackfn: (value: RelatedContentViewModel<GenericViewModel>, index: number, array: RelatedContentViewModel<GenericViewModel>[]) => void, thisArg?: unknown): void {
    const me = thisArg || this;
    this
      .toArray()
      .forEach((value, index, arr) => callbackfn.call(me, value, index, arr));
  }

  concat(concat: NostrViewModelSet<GenericViewModel>): NostrViewModelSet<GenericViewModel> {
    const clone = concat.clone();
    //  FIXME: isso obrigará o array de clone recriar todos os objetos de relacionamento da coleção anterior
    //  Se de alguma maneira os objetos de relacionamento forem clonados e preservados e alimentados, ao invés
    //  de recriados, então será evitada reexecução de boa quantidade de lógica a cada clonagem
    this.toArray().forEach(item => clone.add(item.viewModel));
    return clone;
  }

  clone(): NostrViewModelSet<GenericViewModel> {
    const generic = new NostrViewModelSet<GenericViewModel>();

    generic.sortedDisplay = (new Array<string>()).concat(this.sortedDisplay);
    generic.indexed = { ...this.indexed };
    generic.iterable = (new Array<RelatedContentViewModel<GenericViewModel>>()).concat(this.iterable);

    return generic;
  }

  protected factoryRelatedContentFromViewModel(viewModel: GenericViewModel): RelatedContentViewModel<GenericViewModel> {
    return {
      mentioned: new Set(),
      reactions: {},
      zaps: new Set(),
      viewModel,
      reposted: new Set(),
      repliedBy: new Set()
    };
  }

  protected factoryRelatedContentFromHexadecimal(id: HexString): RelatedContentViewModel<LazyNoteViewModel> {
    return {
      mentioned: new Set(),
      reactions: {},
      zaps: new Set(),
      viewModel: {
        id,
        author: null,
        event: null,
        origin: [],
        content: undefined,
        media: undefined,
        location: undefined,
        createdAt: -Infinity
      },
      reposted: new Set(),
      repliedBy: new Set()
    };
  }

  get size(): number {
    return this.sortedDisplay.length;
  }
}
