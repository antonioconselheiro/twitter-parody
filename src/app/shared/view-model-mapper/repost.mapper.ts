import { Inject, Injectable } from '@angular/core';
import { MAIN_NCACHE_TOKEN } from '@belomonte/nostr-ngx';
import { NCache, NostrEvent } from '@nostrify/nostrify';
import { RepostNoteViewModel } from '../../view-model/repost-note.view-model';

@Injectable({
  providedIn: 'root'
})
export class RepostMapper {
  constructor(
    @Inject(MAIN_NCACHE_TOKEN) private ncache: NCache
  ) { }

  toViewModel(event: NostrEvent): RepostNoteViewModel {
    const content = event.content || '';
  }
}