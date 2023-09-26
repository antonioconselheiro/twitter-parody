import { TNostrPublic } from "./nostr-public.type";
import { TEventId } from "./event-id.type";

export interface IReaction {
  id: TEventId;
  content: string;
  tweet: TEventId;
  author: TNostrPublic;
}
