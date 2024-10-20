import { NostrEventViewModel } from "./nostr-event.view-model";

/**
 * Ready to render zap data
 */
export interface ZapViewModel extends NostrEventViewModel {
  amount: number;
}
