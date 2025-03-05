import { Account, AccountRaw } from "@belomonte/nostr-ngx";
import { EagerNoteViewModel } from "@view-model/eager-note.view-model";
import { LazyNoteViewModel } from "@view-model/lazy-note.view-model";
import { NostrViewModelSet } from "@view-model/nostr-view-model.set";
import { NoteViewModel } from "@view-model/note.view-model";

/**
 * data about repling and be replied
 */
export interface NoteReplyContext<AccountViewModel extends Account = Account> {

  /**
   * first message from thread
   */
  rootRepling?: NoteViewModel<AccountViewModel>;

  /**
   * if this simple text is a reply, this will be
   * filled with the replied note
   */
  replyTo?: NoteViewModel<AccountViewModel>;

  /**
   * List of ids of replies to this event
   */
  replies: NostrViewModelSet<EagerNoteViewModel<AccountViewModel>, AccountViewModel> | NostrViewModelSet<LazyNoteViewModel, AccountRaw>;
}