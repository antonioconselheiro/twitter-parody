import { Account, AccountRenderable } from "@belomonte/nostr-ngx";
import { NoteViewModel } from "@view-model/note.view-model";

export interface TweetImageViewing {
  note: NoteViewModel<Account>;
  img: string;
}
