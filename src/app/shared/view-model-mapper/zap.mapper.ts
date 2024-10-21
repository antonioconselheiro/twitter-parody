import { Inject, Injectable } from '@angular/core';
import { NCache } from '@nostrify/nostrify';
import { MAIN_NCACHE_TOKEN } from '@belomonte/nostr-ngx';
import { ZapViewModel } from '@view-model/zap.view-model';

@Injectable({
  providedIn: 'root'
})
export class ZapMapper {

  constructor(
    @Inject(MAIN_NCACHE_TOKEN) private ncache: NCache
  ) { }

  toViewModel(event: NostrEvent): ZapViewModel {

  }
}
