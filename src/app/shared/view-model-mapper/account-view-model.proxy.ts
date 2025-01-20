import { Injectable } from '@angular/core';
import { FeedViewModel } from '@view-model/feed.view-model';

@Injectable({
  providedIn: 'root'
})
export class AccountViewModelProxy {

  loadViewModelAccounts(feed: FeedViewModel) {
    //  TODO: must load the account from each account available
    //  TODO: likes and zaps must have and special view model object, the major part of likes and zaps
    //  must not be fully loaded in note view model, neither calculated if possible, this will be
    //  used exclusivelly to show how much reactions and zaps the note had, more information should
    //  be load exclusivelly if is identified that the user has the intention of access that information
    //  or if the user accessed that information  
  }
}
