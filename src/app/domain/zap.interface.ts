import { Reaction } from "./reaction.interface";

export interface Zap extends Reaction {
  amount?: number;
}