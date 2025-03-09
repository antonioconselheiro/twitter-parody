import { Account, HexString } from '@belomonte/nostr-ngx';
import { NostrEventViewModel } from './nostr-event.view-model';

/**
 * Set of ready to render nostr data.
 * Data is added in correct position, sorted by event created timestamp.
 */
export class NostrViewModelSet<
  GenericViewModel extends NostrEventViewModel<AccountViewModel>,
  AccountViewModel extends Account = Account
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

  override[Symbol.iterator](): IterableIterator<GenericViewModel> {
    return this.sorted.map(id => this.indexed[id])[Symbol.iterator]();
  }

  override add(value: GenericViewModel): this {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const reflection: { [properties: string]: unknown } | null = this.get(value.id) as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const valueReflection: { [properties: string]: unknown } = value as any;

    //  if the register exists it is merged into a single view model,
    //  if don't exists, it is included in the right order
    if (reflection) {
      Object.keys(value).forEach(attr => {
        if (valueReflection[attr] instanceof NostrViewModelSet && reflection[attr] instanceof NostrViewModelSet) {
          valueReflection[attr] = valueReflection[attr].concat(reflection[attr]);
        }
      });
    }

    this.indexed[value.id] = value;
    const indexNotFound = -1;
    const index = this.sorted.findIndex(id => this.indexed[id].createdAt < value.createdAt);
    if (index === indexNotFound) {
      this.sorted.push(value.id);
    } else {
      this.sorted.splice(index, 0, value.id);
    }

    return this;
  }

  get(eventId: HexString): GenericViewModel {
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
    [...this].forEach((value) => {
      callbackfn.call(thisArg, value, value, this);
    });
  }

  concat(combine: NostrViewModelSet<GenericViewModel, AccountViewModel>): NostrViewModelSet<GenericViewModel, AccountViewModel> {
    const merge = new NostrViewModelSet<GenericViewModel, AccountViewModel>([...combine]);
    [...this].forEach(item => merge.add(item));
    return merge;
  }

  override get size(): number {
    return this.sorted.length;
  }
}
