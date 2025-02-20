import { Injectable } from '@angular/core';
import { ProfileProxy } from '@belomonte/nostr-ngx';
import { FeedViewModel } from '@view-model/feed.view-model';

@Injectable({
  providedIn: 'root'
})
export class AccountViewModelProxy {

  constructor(
    private profileProxy: ProfileProxy
  ) { }

  async loadViewModelAccounts(feed: FeedViewModel): Promise<void> {

    for await (let note of feed) {
      await this.profileProxy.loadAccount(note.author.pubkey, 'essential');
    }

    //  TODO: preciso criar um tipo de conta que seja "não calculado", que não tem nem o npub
    //  TODO: must load the account from each account available
    //  TODO: likes and zaps must have and special view model object, the major part of likes and zaps
    //  must not be fully loaded in note view model, neither calculated if possible, this will be
    //  used exclusivelly to show how much reactions and zaps the note had, more information should
    //  be load exclusivelly if is identified that the user has the intention of access that information
    //  or if the user accessed that information  
  }
}
