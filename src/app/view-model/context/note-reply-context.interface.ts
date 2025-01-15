import { Account } from "@belomonte/nostr-ngx";
import { NoteViewModel } from "@view-model/note.view-model";
import { SortedNostrViewModelSet } from "@view-model/sorted-nostr-view-model.set";

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
  replies: SortedNostrViewModelSet<NoteViewModel<AccountViewModel>, AccountViewModel>;
}