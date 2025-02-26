import { Injectable } from '@angular/core';
import { AccountRaw, NostrEvent, NostrGuard, ProfileProxy } from '@belomonte/nostr-ngx';
import { NostrViewModelSet } from '@view-model/nostr-view-model.set';
import { ZapViewModel } from '@view-model/zap.view-model';
import { Zap } from 'nostr-tools/kinds';
import { SingleViewModelMapper } from './single-view-model.mapper';
import { TagHelper } from './tag.helper';

@Injectable({
  providedIn: 'root'
})
export class ZapMapper implements SingleViewModelMapper<ZapViewModel<AccountRaw>> {

  constructor(
    private tagHelper: TagHelper,
    private profileProxy: ProfileProxy,
    private guard: NostrGuard
  ) { }

  toViewModel(event: NostrEvent): ZapViewModel<AccountRaw> | null;
  toViewModel(event: NostrEvent<Zap>): ZapViewModel<AccountRaw>;
  toViewModel(event: Array<NostrEvent>): NostrViewModelSet<ZapViewModel<AccountRaw>, AccountRaw>;
  toViewModel(event: NostrEvent | Array<NostrEvent>): ZapViewModel<AccountRaw> | NostrViewModelSet<ZapViewModel<AccountRaw>, AccountRaw> | null;
  toViewModel(event: NostrEvent | Array<NostrEvent>): ZapViewModel<AccountRaw> | NostrViewModelSet<ZapViewModel<AccountRaw>, AccountRaw> | null {
    if (event instanceof Array) {
      return this.toViewModelCollection(event);
    } else if (this.guard.isKind(event, Zap)) {
      return this.toSingleViewModel(event);
    }

    return null;
  }

  private toSingleViewModel(event: NostrEvent<Zap>): ZapViewModel<AccountRaw> {
    const reactedTo = this.tagHelper.listIdsFromTag('e', event);

    // TODO: validate zap data with zod
    const amountZapped = this.tagHelper.getTagValueByType('amount', event);
    const author = this.profileProxy.getRawAccount(event.pubkey);

    return {
      id: event.id,
      event,
      content: event.content,
      reactedTo,
      author,
      //  TODO: ideally I should pass relay address from where this event come
      origin: [],
      amount: amountZapped ? Number(amountZapped) : null,
      createdAt: event.created_at
    };
  }

  private toViewModelCollection(events: Array<NostrEvent>): NostrViewModelSet<ZapViewModel<AccountRaw>, AccountRaw> {
    const zapSet = new NostrViewModelSet<ZapViewModel<AccountRaw>, AccountRaw>();

    for (const event of events) {
      if (this.guard.isKind(event, Zap)) {
        const viewModel = this.toSingleViewModel(event);
        zapSet.add(viewModel);
      }
    }

    return zapSet;
  }
}
