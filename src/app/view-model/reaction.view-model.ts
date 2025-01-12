import { Account, HexString } from '@belomonte/nostr-ngx';
import { NostrEventViewModel } from './nostr-event.view-model';

/**
 * Ready to render reaction data
 */
export interface ReactionViewModel<AccountViewModel extends Account = Account> extends NostrEventViewModel<AccountViewModel> {

  /**
   * id of reacted event, It can be only one, but can be a list also
   */
  reactedTo: Array<HexString>;

  /**
   * one char or one emoji
   */
  content: string;

}
