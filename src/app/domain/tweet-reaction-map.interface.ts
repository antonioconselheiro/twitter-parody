import { TEventId } from './event-id.type';
import { IReaction } from './reaction.interface';

export type ITweetReactionMap = {
  [idEvent: TEventId]: IReaction
}
