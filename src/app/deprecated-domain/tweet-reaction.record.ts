import { Reaction } from './reaction.interface';

export type TweetReactionRecord = {
  [idEvent: string]: Reaction
}
