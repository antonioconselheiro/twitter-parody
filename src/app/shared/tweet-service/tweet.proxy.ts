import { Injectable } from "@angular/core";
import { EagerNoteViewModel } from "@view-model/eager-note.view-model";
import { NEvent } from "nostr-tools/nip19";

@Injectable({
  providedIn: 'root'
})
export class TweetProxy {
  loadTweet(nevent: NEvent): Promise<EagerNoteViewModel> {

  }
}
