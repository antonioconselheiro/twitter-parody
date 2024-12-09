import { HexString } from "@belomonte/nostr-ngx";

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
  replies: Array<HexString>;
}