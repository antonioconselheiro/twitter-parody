import { Inject, Injectable } from '@angular/core';
import { MAIN_NCACHE_TOKEN } from '@belomonte/nostr-ngx';
import { NCache } from '@nostrify/nostrify';

@Injectable({
  providedIn: 'root'
})
export class ReactionMapper {

  constructor(
    @Inject(MAIN_NCACHE_TOKEN) private ncache: NCache
  ) { }

  toViewModel() {

  }
}
