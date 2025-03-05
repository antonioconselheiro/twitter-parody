import { Account } from "@belomonte/nostr-ngx";
import { SimpleTextNoteViewModel } from "./simple-text-note.view-model";
import { RepostNoteViewModel } from "./repost-note.view-model";

export type EagerNoteViewModel<AccountViewModel extends Account = Account> = SimpleTextNoteViewModel<AccountViewModel> | RepostNoteViewModel<AccountViewModel>;
