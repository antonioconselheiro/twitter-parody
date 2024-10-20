import { NostrEventViewModel } from './nostr-event.view-model';

/**
 * Set of ready to render nostr data.
 * Data is added in correct position, sorted by event created timestamp.
 */
export class SortedNostrViewModelSet<T extends NostrEventViewModel> extends Set<T> {

  #items: T[] = [];

  constructor(values?: readonly T[] | null) {
    super();
    if (values) {
      values.forEach(value => this.add(value));
    }
  }

  override [Symbol.iterator](): IterableIterator<T> {
    return this.#items[Symbol.iterator]();
  }

  override add(value: T): this {
    if (!this.has(value)) {
      const indexNotFound = -1;
      const index = this.#items.findIndex(item => item.createdAt > value.createdAt);
      if (index === indexNotFound) {
        this.#items.push(value);
      } else {
        this.#items.splice(index, 0, value);
      }

      super.add(value);
    }
    return this;
  }

  override delete(value: T): boolean {
    const indexNotFound = -1;
    const index = this.#items.indexOf(value);
    if (index !== indexNotFound) {
      this.#items.splice(index, 1);
      return super.delete(value);
    }
    return false;
  }

  override clear(): void {
    this.#items = [];
    super.clear();
  }

  override values(): IterableIterator<T> {
    return this.#items.values();
  }

  override forEach(callbackfn: (value: T, value2: T, set: Set<T>) => void, thisArg?: unknown): void {
    this.#items.forEach((value) => {
      callbackfn.call(thisArg, value, value, this);
    });
  }

  override get size(): number {
    return this.#items.length;
  }
}
