import { Inject, Injectable } from '@angular/core';
import { NCache, NostrEvent } from '@nostrify/nostrify';
import { MAIN_NCACHE_TOKEN } from '@belomonte/nostr-ngx';
import { ZapViewModel } from '@view-model/zap.view-model';
import { ViewModelMapper } from './view-model.mapper';
import { SortedNostrViewModelSet } from '@view-model/sorted-nostr-view-model.set';

@Injectable({
  providedIn: 'root'
})
export class ZapMapper implements ViewModelMapper<ZapViewModel> {

  constructor(
    @Inject(MAIN_NCACHE_TOKEN) private ncache: NCache
  ) { }

  toViewModel(event: NostrEvent): Promise<ZapViewModel>;
  toViewModel(event: Array<NostrEvent>): Promise<SortedNostrViewModelSet<ZapViewModel>>;
  toViewModel(event: NostrEvent | Array<NostrEvent>): Promise<ZapViewModel | SortedNostrViewModelSet<ZapViewModel>> {
    if (event instanceof Array) {
      return this.toMultipleViewModel(event);
    } else {
      return this.toSingleViewModel(event);
    }
  }

  private toSingleViewModel(event: NostrEvent): Promise<ZapViewModel> {

  }

  private toMultipleViewModel(events: Array<NostrEvent>): Promise<SortedNostrViewModelSet<ZapViewModel>> {

  }
}
