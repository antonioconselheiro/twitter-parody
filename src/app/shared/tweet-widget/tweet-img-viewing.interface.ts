import { AccountRenderable } from "@belomonte/nostr-ngx";
import { NoteViewModel } from "@view-model/note.view-model";

export interface TweetImageViewing {
  note: NoteViewModel<AccountRenderable>;
  img: string;
}
