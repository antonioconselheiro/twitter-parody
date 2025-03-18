import { HexString, NostrEvent } from '@belomonte/nostr-ngx';
import { NostrEventIdViewModel } from './nostr-event-id.view-model';
import { NostrEventViewModel } from './nostr-event.view-model';
import { NoteReflectionViewModel } from './note-reflection.view-model';

/**
 * Set of ready to render nostr data.
 * Data is added in correct position, sorted by event created timestamp.
 */
export class NostrViewModelSet<
  GenericViewModel extends NostrEventIdViewModel | NostrEventViewModel
> extends Set<GenericViewModel> {

  /**
   * here are available only the events that must be rendered with
   * the ids arranged in order from newest event to oldest
   */
  protected sorted = new Array<HexString>();

  /**
   * Here is added every event related to the collection
   */
  protected indexed: { [id: HexString]: GenericViewModel } = {};

  constructor(values?: readonly GenericViewModel[] | null) {
    super();

    if (values) {
      values.forEach(value => this.add(value));
    }
  }

  toEventList(): Array<NostrEvent> {
    return this
      .toArray()
      .map(note => 'event' in note ? note.event : null)
      .filter((e: NostrEvent | null): e is NostrEvent => !!e);
  }

  toArray(): Array<GenericViewModel> {
    return [...this];
  }

  override[Symbol.iterator](): IterableIterator<GenericViewModel> {
    return this.sorted.map(id => this.indexed[id])[Symbol.iterator]();
  }

  override add(value: GenericViewModel): this {
    this.indexEvent(value);
    const indexNotFound = -1;
    const index = this.sorted.findIndex(id => this.indexed[id].createdAt < value.createdAt);
    if (index === indexNotFound) {
      this.sorted.push(value.id);
    } else {
      this.sorted.splice(index, 0, value.id);
    }

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

      Object.keys(valueReflection).forEach(attr => {
        if (valueReflection[attr] instanceof NostrViewModelSet && reflection[attr] instanceof NostrViewModelSet) {
          reflection[attr] = valueReflection[attr] = valueReflection[attr].concat(reflection[attr]);
        }
      });

      valueReflection.createdAt = reflection.createdAt;
    }

    this.indexed[value.id] = value;
  }

  indexEvents(list: Array<GenericViewModel>): void {
    list.forEach(value => this.indexEvent(value));
  }

  get(eventId: HexString): GenericViewModel | undefined {
    return this.indexed[eventId];
  }

  override delete(value: GenericViewModel): boolean {
    const indexNotFound = -1;
    const index = this.sorted.indexOf(value.id);

    if (index !== indexNotFound) {
      this.sorted.splice(index, 1);
      delete this.indexed[value.id];
      return true;
    }

    return false;
  }

  override clear(): void {
    this.sorted = [];
    this.indexed = {};
    super.clear();
  }

  override values(): IterableIterator<GenericViewModel> {
    return this.sorted.map(id => this.indexed[id]).values();
  }

  override forEach(callbackfn: (value: GenericViewModel, value2: GenericViewModel, set: Set<GenericViewModel>) => void, thisArg?: unknown): void {
    this.toArray().forEach((value) => {
      callbackfn.call(thisArg, value, value, this);
    });
  }

  concat(combine: NostrViewModelSet<GenericViewModel>): NostrViewModelSet<GenericViewModel> {
    const merge = new NostrViewModelSet<GenericViewModel>([...combine]);
    this.toArray().forEach(item => merge.add(item));
    return merge;
  }

  override get size(): number {
    return this.sorted.length;
  }
}
