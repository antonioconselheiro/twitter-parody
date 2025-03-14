import { NostrViewModelSet } from "@view-model/nostr-view-model.set";
import { NoteViewModel } from "@view-model/note.view-model";

/**
 * data about repling and be replied
 */
export interface NoteReplyContext {

  /**
   * first message from thread
   */
  rootRepling?: NoteViewModel;

  /**
   * if this simple text is a reply, this will be
   * filled with the replied note
   */
  replyTo?: NoteViewModel;

  /**
   * List of ids of replies to this event
   */
  replies: NostrViewModelSet<NoteViewModel>;
}