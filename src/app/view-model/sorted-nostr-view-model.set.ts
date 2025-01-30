import { Account } from '@belomonte/nostr-ngx';
import { NostrEventViewModel } from './nostr-event.view-model';

// TODO: FIXME: está invertida a ordem, precisa ser do mais recente para o mais antigo
// FIXME: não tenho certeza se este delete está funcionando, seria bom pesquisar o evento pelo id
/**
 * Set of ready to render nostr data.
 * Data is added in correct position, sorted by event created timestamp.
 */
export class SortedNostrViewModelSet<
  GenericViewModel extends NostrEventViewModel<AccountViewModel>,
  AccountViewModel extends Account = Account
> extends Set<GenericViewModel> {

  #items: GenericViewModel[] = [];

  constructor(values?: readonly GenericViewModel[] | null) {
    super();

    if (values) {
      values.forEach(value => this.add(value));
    }
  }

  override[Symbol.iterator](): IterableIterator<GenericViewModel> {
    return this.#items[Symbol.iterator]();
  }

  override add(value: GenericViewModel): this {
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

  override delete(value: GenericViewModel): boolean {
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

  override values(): IterableIterator<GenericViewModel> {
    return this.#items.values();
  }

  override forEach(callbackfn: (value: GenericViewModel, value2: GenericViewModel, set: Set<GenericViewModel>) => void, thisArg?: unknown): void {
    this.#items.forEach((value) => {
      callbackfn.call(thisArg, value, value, this);
    });
  }

  concat(combine: SortedNostrViewModelSet<GenericViewModel, AccountViewModel>): SortedNostrViewModelSet<GenericViewModel, AccountViewModel> {
    return new SortedNostrViewModelSet<GenericViewModel, AccountViewModel>([...combine, ...this]);
  }

  override get size(): number {
    return this.#items.length;
  }
}
