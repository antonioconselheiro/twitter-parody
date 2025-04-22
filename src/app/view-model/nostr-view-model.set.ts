import { HexString, NostrEvent } from '@belomonte/nostr-ngx';
import { NostrEventIdViewModel } from './nostr-event-id.view-model';
import { NostrEventViewModel } from './nostr-event.view-model';
import { NoteReflectionViewModel } from './note-reflection.view-model';
import { RelatedContentViewModel } from './related-content.view-model';

/**
 * Set of ready to render nostr data.
 * Data is added in correct position, sorted by event created timestamp.
 */
export class NostrViewModelSet<GenericViewModel extends NostrEventIdViewModel | NostrEventViewModel> {

  /**
   * here are available only the events that must be rendered with
   * the ids arranged in order from newest event to oldest
   */
  protected sorted = new Array<HexString>();

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

  add(value: GenericViewModel): this {
    this.indexEvent(value);
    const indexNotFound = -1;
    const index = this.sorted.findIndex(id => this.indexed[id].viewModel.createdAt < value.createdAt);
    if (index === indexNotFound) {
      this.sorted.push(value.id);
    } else {
      this.sorted.splice(index, 0, value.id);
    }

    this.iterable = this.sorted.map(id => this.indexed[id]);
    return this;
  }

  /**
   * this method will index the event, or merge if it already
   * exists, and relate to other events in the feed
   */
  indexEvent(value: GenericViewModel): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let reflection: NoteReflectionViewModel = this.get(value.id) as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let valueReflection: NoteReflectionViewModel = value as any;

    //  if the register exists it is merged into a single view model,
    //  if don't exists, it is included in the right order
    if (reflection) {

      //  If reflection is lazy load view model (it has -Infinity set as createdAt),
      //  then it changes of position for the view model, expecting it is a eager
      //  load view model, but if it isn't eager, but lazy, will have no problem
      if (!Number.isFinite(valueReflection.createdAt)) {
        valueReflection = reflection;
        reflection = value as any as NoteReflectionViewModel;
      }

      valueReflection.createdAt = reflection.createdAt;
    }

    this.indexed[value.id].viewModel = value;
  }

  indexEvents(list: Array<GenericViewModel>): void {
    list.forEach(value => this.indexEvent(value));
  }

  get(eventId: HexString): GenericViewModel | undefined {
    return this.indexed[eventId].viewModel;
  }

  delete(value: GenericViewModel): boolean {
    const indexNotFound = -1;
    const index = this.sorted.indexOf(value.id);

    if (index !== indexNotFound) {
      this.sorted.splice(index, 1);
      delete this.indexed[value.id];
      return true;
    }

    return false;
  }

  clear(): void {
    this.sorted = [];
    this.indexed = {};
  }

  values(): IterableIterator<GenericViewModel> {
    return this.sorted.map(id => this.indexed[id].viewModel).values();
  }

  forEach(callbackfn: (value: GenericViewModel, value2: GenericViewModel, set: Set<GenericViewModel>) => void, thisArg?: unknown): void {
    this.toArray().forEach((value) => {
      callbackfn.call(thisArg, value, value, this);
    });
  }

  concat(combine: NostrViewModelSet<GenericViewModel>): NostrViewModelSet<GenericViewModel> {
    const clone = combine.clone();
    this.toArray().forEach(item => clone.add(item));
    return clone;
  }

  clone(): NostrViewModelSet<GenericViewModel> {
    const generic = new NostrViewModelSet<GenericViewModel>();

    generic.sorted = this.sorted;
    generic.indexed = this.indexed;
    generic.iterable = this.iterable;

    return generic;
  }

  get size(): number {
    return this.sorted.length;
  }
}
