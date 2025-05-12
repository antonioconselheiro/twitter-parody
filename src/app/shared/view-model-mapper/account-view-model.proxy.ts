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
    for await (const related of feed) {
      if (!this.accountGuard.isRenderableGroup(related.viewModel.author)) {
        if (related.viewModel.author) {
          await this.profileProxy.loadAccount(related.viewModel.author.pubkey, 'essential');
        }
      }
    }
  }
}
