import { Account, AccountRaw, HexString } from '@belomonte/nostr-ngx';
import { NostrEventViewModel } from './nostr-event.view-model';

/**
 * Ready to render reaction data
 */
export interface ReactionViewModel<AccountViewModel extends Account = AccountRaw> extends NostrEventViewModel<AccountViewModel> {

  /**
   * id of reacted event, It can be only one, but can be a list also
   */
  reactedTo: Array<HexString>;

  /**
   * one char or one emoji
   */
  content: string;

  /**
   * author account or just the author pubkey
   */
  author: AccountViewModel;

}
