import { Account } from "@belomonte/nostr-ngx";
import { ReactionViewModel } from "./reaction.view-model";

/**
 * Ready to render zap data
 */
export interface ZapViewModel<AccountViewModel extends Account = Account> extends ReactionViewModel<AccountViewModel> {
  amount: number | null;
}
