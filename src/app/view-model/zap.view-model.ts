import { ReactionViewModel } from "./reaction.view-model";

/**
 * Ready to render zap data
 */
export interface ZapViewModel extends ReactionViewModel {
  amount: number;
}
