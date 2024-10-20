import { Inject, Injectable } from '@angular/core';
import { MAIN_NCACHE_TOKEN } from '@belomonte/nostr-ngx';
import { NCache, NostrEvent } from '@nostrify/nostrify';
import { HtmlfyService } from '@shared/htmlfy/htmlfy.service';

@Injectable({
  providedIn: 'root'
})
export class SimpleTextMapper {

  constructor(
    private htmlfyService: HtmlfyService,
    @Inject(MAIN_NCACHE_TOKEN) private ncache: NCache
  ) { }

  toViewModel(event: NostrEvent):  {

  }
}
