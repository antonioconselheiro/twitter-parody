import { Component, Input } from '@angular/core';
import { Account, HexString, ProfileProxy } from '@belomonte/nostr-ngx';
import { NoteViewModel } from '@view-model/note.view-model';
import { RelatedContentViewModel } from '@view-model/related-content.view-model';

@Component({
  selector: 'tw-tweet',
  templateUrl: './tweet.component.html',
  styleUrl: './tweet.component.scss'
})
export class TweetComponent {

  @Input()
  tweet: RelatedContentViewModel<NoteViewModel> | null = null;

  constructor(
    private profileProxy: ProfileProxy
  ) { }

  getAccount(pubkey: HexString | undefined): Account | null {
    if (!pubkey) {
      return null;
    }

    return this.profileProxy.getAccount(pubkey);
  }
}
