import { HexString } from '@belomonte/nostr-ngx';
import { NostrEventViewModel } from './nostr-event.view-model';

/**
 * Ready to render reaction data
 */
export interface ReactionViewModel extends NostrEventViewModel {

  /**
   * id of reacted event, It can be only one, but can be a list also
   */
  reactedTo: Array<HexString>;

  /**
   * one char or one emoji
   */
  content: string;

}
