import { NostrEventViewModel } from './nostr-event.view-model';

/**
 * Ready to render reaction data
 */
export interface ReactionViewModel extends NostrEventViewModel {

  /**
   * id of reacted event
   */
  reactedTo: string;

  /**
   * one char or one emoji
   */
  content: string;

}
