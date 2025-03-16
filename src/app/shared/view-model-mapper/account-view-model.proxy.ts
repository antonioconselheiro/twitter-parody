import { Injectable } from '@angular/core';
import { AccountGuard, ProfileProxy } from '@belomonte/nostr-ngx';
import { FeedViewModel } from '@view-model/feed.view-model';

@Injectable({
  providedIn: 'root'
})
export class AccountViewModelProxy {

  constructor(
    private accountGuard: AccountGuard,
    private profileProxy: ProfileProxy
  ) { }

  async loadViewModelAccounts(feed: FeedViewModel): Promise<void> {
    for await (const note of feed) {
      if (!this.accountGuard.isRenderableGroup(note.author)) {
        if (note.author) {
          await this.profileProxy.loadAccount(note.author.pubkey, 'essential');
        }
      }
    }
  }
}
