import { Injectable } from '@angular/core';
import { NostrEvent, NostrGuard, ProfileProxy } from '@belomonte/nostr-ngx';
import { NostrViewModelSet } from '@view-model/nostr-view-model.set';
import { ZapViewModel } from '@view-model/zap.view-model';
import { Zap } from 'nostr-tools/kinds';
import { SingleViewModelMapper } from './single-view-model.mapper';
import { TagHelper } from './tag.helper';

@Injectable({
  providedIn: 'root'
})
export class ZapMapper implements SingleViewModelMapper<ZapViewModel> {

  constructor(
    private tagHelper: TagHelper,
    private profileProxy: ProfileProxy,
    private guard: NostrGuard
  ) { }

  toViewModel(event: NostrEvent): ZapViewModel | null;
  toViewModel(event: NostrEvent<Zap>): ZapViewModel;
  toViewModel(event: Array<NostrEvent>): NostrViewModelSet<ZapViewModel>;
  toViewModel(event: NostrEvent | Array<NostrEvent>): ZapViewModel | NostrViewModelSet<ZapViewModel> | null;
  toViewModel(event: NostrEvent | Array<NostrEvent>): ZapViewModel | NostrViewModelSet<ZapViewModel> | null {
    if (event instanceof Array) {
      return this.toViewModelCollection(event);
    } else if (this.guard.isKind(event, Zap)) {
      return this.toSingleViewModel(event);
    }

    return null;
  }

  private toSingleViewModel(event: NostrEvent<Zap>): ZapViewModel {
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

  private toViewModelCollection(events: Array<NostrEvent>): NostrViewModelSet<ZapViewModel> {
    const zapSet = new NostrViewModelSet<ZapViewModel>();

    for (const event of events) {
      if (this.guard.isKind(event, Zap)) {
        const viewModel = this.toSingleViewModel(event);
        zapSet.add(viewModel);
      }
    }

    return zapSet;
  }
}
