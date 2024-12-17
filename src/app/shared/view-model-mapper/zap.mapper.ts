import { Injectable } from '@angular/core';
import { NostrEvent, NostrGuard, ProfileService } from '@belomonte/nostr-ngx';
import { SortedNostrViewModelSet } from '@view-model/sorted-nostr-view-model.set';
import { ZapViewModel } from '@view-model/zap.view-model';
import { Zap } from 'nostr-tools/kinds';
import { TagHelper } from './tag.helper';
import { SingleViewModelMapper } from './view-model.mapper';

@Injectable({
  providedIn: 'root'
})
export class ZapMapper implements SingleViewModelMapper<ZapViewModel> {

  constructor(
    private tagHelper: TagHelper,
    private profileService: ProfileService,
    private guard: NostrGuard
  ) { }

  toViewModel(event: NostrEvent): Promise<ZapViewModel | null>;
  toViewModel(event: NostrEvent<Zap>): Promise<ZapViewModel>;
  toViewModel(event: Array<NostrEvent>): Promise<SortedNostrViewModelSet<ZapViewModel>>;
  toViewModel(event: NostrEvent | Array<NostrEvent>): Promise<ZapViewModel | SortedNostrViewModelSet<ZapViewModel> | null>;
  toViewModel(event: NostrEvent | Array<NostrEvent>): Promise<ZapViewModel | SortedNostrViewModelSet<ZapViewModel> | null> {
    if (event instanceof Array) {
      return this.toMultipleViewModel(event);
    } else if (this.guard.isKind(event, Zap)) {
      return this.toSingleViewModel(event);
    }

    return Promise.resolve(null);
  }

  private async toSingleViewModel(event: NostrEvent<Zap>): Promise<ZapViewModel> {
    const reactedTo = this.tagHelper.listIdsFromTag('e', event);

    // TODO: validate zap data with zod
    const amountZapped = this.tagHelper.getTagValueByType('amount', event);
    const author = await this.profileService.loadAccount(event.pubkey);

    return Promise.resolve({
      id: event.id,
      origin: event,
      content: event.content,
      reactedTo,
      author,
      amount: amountZapped ? Number(amountZapped) : null,
      createdAt: event.created_at
    });
  }

  private async toMultipleViewModel(events: Array<NostrEvent>): Promise<SortedNostrViewModelSet<ZapViewModel>> {
    const zapSet = new SortedNostrViewModelSet<ZapViewModel>();

    for await (const event of events) {
      if (this.guard.isKind(event, Zap)) {
        const viewModel = await this.toSingleViewModel(event);
        zapSet.add(viewModel);
      }
    }

    return Promise.resolve(zapSet);
  }
}
