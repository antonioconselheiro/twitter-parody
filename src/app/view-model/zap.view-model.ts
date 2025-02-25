import { Account, AccountRaw } from "@belomonte/nostr-ngx";
import { ReactionViewModel } from "./reaction.view-model";

/**
 * Ready to render zap data
 */
export interface ZapViewModel<AccountViewModel extends Account | AccountRaw = AccountRaw> extends ReactionViewModel<AccountViewModel> {
  amount: number | null;
}
