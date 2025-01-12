import { Injectable } from '@angular/core';
import { Account, NostrEvent, NostrGuard, ProfileProxy } from '@belomonte/nostr-ngx';
import { SortedNostrViewModelSet } from '@view-model/sorted-nostr-view-model.set';
import { ZapViewModel } from '@view-model/zap.view-model';
import { Zap } from 'nostr-tools/kinds';
import { SingleViewModelMapper } from './single-view-model.mapper';
import { TagHelper } from './tag.helper';

@Injectable({
  providedIn: 'root'
})
export class ZapMapper implements SingleViewModelMapper<ZapViewModel<Account>> {

  constructor(
    private tagHelper: TagHelper,
    private profileProxy: ProfileProxy,
    private guard: NostrGuard
  ) { }

  toViewModel(event: NostrEvent): Promise<ZapViewModel<Account> | null>;
  toViewModel(event: NostrEvent<Zap>): Promise<ZapViewModel<Account>>;
  toViewModel(event: Array<NostrEvent>): Promise<SortedNostrViewModelSet<ZapViewModel<Account>>>;
  toViewModel(event: NostrEvent | Array<NostrEvent>): Promise<ZapViewModel<Account> | SortedNostrViewModelSet<ZapViewModel<Account>> | null>;
  toViewModel(event: NostrEvent | Array<NostrEvent>): Promise<ZapViewModel<Account> | SortedNostrViewModelSet<ZapViewModel<Account>> | null> {
    if (event instanceof Array) {
      return this.toMultipleViewModel(event);
    } else if (this.guard.isKind(event, Zap)) {
      return this.toSingleViewModel(event);
    }

    return Promise.resolve(null);
  }

  private async toSingleViewModel(event: NostrEvent<Zap>): Promise<ZapViewModel<Account>> {
    const reactedTo = this.tagHelper.listIdsFromTag('e', event);

    // TODO: validate zap data with zod
    const amountZapped = this.tagHelper.getTagValueByType('amount', event);
    const author = await this.profileProxy.loadAccount(event.pubkey, 'calculated');

    return Promise.resolve({
      id: event.id,
      event,
      content: event.content,
      reactedTo,
      author,
      //  TODO: ideally I should pass relay address from where this event come
      origin: [],
      amount: amountZapped ? Number(amountZapped) : null,
      createdAt: event.created_at
    });
  }

  private async toMultipleViewModel(events: Array<NostrEvent>): Promise<SortedNostrViewModelSet<ZapViewModel<Account>>> {
    const zapSet = new SortedNostrViewModelSet<ZapViewModel<Account>>();

    for await (const event of events) {
      if (this.guard.isKind(event, Zap)) {
        const viewModel = await this.toSingleViewModel(event);
        zapSet.add(viewModel);
      }
    }

    return Promise.resolve(zapSet);
  }
}
