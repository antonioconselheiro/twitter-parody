import { Inject, Injectable } from '@angular/core';
import { MAIN_NCACHE_TOKEN, NostrEvent, NostrGuard } from '@belomonte/nostr-ngx';
import { NCache } from '@nostrify/nostrify';
import { RepostNoteViewModel } from '@view-model/repost-note.view-model';
import { SingleViewModelMapper } from './single-view-model.mapper';

@Injectable({
  providedIn: 'root'
})
export class RepostMapper implements SingleViewModelMapper<RepostNoteViewModel> {
  constructor(
    private guard: NostrGuard,
    @Inject(MAIN_NCACHE_TOKEN) private ncache: NCache
  ) { }

  toViewModel(event: NostrEvent): Promise<RepostNoteViewModel> {

  }
}
