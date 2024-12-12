import { HexString } from "@belomonte/nostr-ngx";
import { NoteViewModel } from "@view-model/note.view-model";
import { SortedNostrViewModelSet } from "@view-model/sorted-nostr-view-model.set";

/**
 * data about repling and be replied
 */
export interface NoteReply {

  /**
   * id hex of first message from thread
   */
  rootRepling?: HexString;

  /**
   * if this simple text is a reply, this field will be
   * filled with the event id of the replied note
   */
  replyTo?: HexString;

  /**
   * List of ids of replies
   */
  replies: SortedNostrViewModelSet<NoteViewModel>;
}