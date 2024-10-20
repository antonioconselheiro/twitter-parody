import { Inject, Injectable } from '@angular/core';
import { MAIN_NCACHE_TOKEN } from '@belomonte/nostr-ngx';
import { NCache, NostrEvent } from '@nostrify/nostrify';
import { DefaultHtmlfyService } from '@shared/htmlfy/default-htmlfy.service';

@Injectable({
  providedIn: 'root'
})
export class SimpleTextMapper {

  constructor(
    private htmlfyService: DefaultHtmlfyService,
    @Inject(MAIN_NCACHE_TOKEN) private ncache: NCache
  ) { }

  toViewModel(event: NostrEvent):  {

  }
}
