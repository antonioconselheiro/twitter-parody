/**
 * data about repling and be replied
 */
export interface NoteReplyContext {

  /**
   * id hex of first message from thread
   */
  rootRepling?: string;

  /**
   * if this simple text is a reply, this field will be
   * filled with the event id of the replied note
   */
  replyTo?: string;

  /**
   * List of ids of replies
   */
  replies: Array<string>;
}