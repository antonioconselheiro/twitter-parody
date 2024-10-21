import { Inject, Injectable } from '@angular/core';
import { MAIN_NCACHE_TOKEN } from '@belomonte/nostr-ngx';
import { NCache, NostrEvent } from '@nostrify/nostrify';
import { ReactionViewModel } from '../../view-model/reaction.view-model';

@Injectable({
  providedIn: 'root'
})
export class ReactionMapper {

  constructor(
    @Inject(MAIN_NCACHE_TOKEN) private ncache: NCache
  ) { }

  toViewModel(event: NostrEvent): ReactionViewModel {

  }
}
