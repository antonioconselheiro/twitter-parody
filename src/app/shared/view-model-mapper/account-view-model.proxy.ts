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
    console.info('LOADING AUTHOR FROM FEED:', [...feed]);
    for await (const note of feed) {
      if (!this.accountGuard.isRenderableGroup(note.author)) {
        console.info('loading author:', note.author, '...');
        note.author = await this.profileProxy.loadAccount(note.author.pubkey, 'essential');
        console.info('loaded author:', note.author);
      }
    }
  }
}
