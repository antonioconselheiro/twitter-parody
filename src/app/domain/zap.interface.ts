import { IReaction } from "./reaction.interface";

export interface IZap extends IReaction {
  amount?: number;
}