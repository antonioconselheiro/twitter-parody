import { NostrPublicType } from "./nostr-public.type";
import { EventId } from "./event-id.type";

export interface IReaction {
  id: EventId;
  content: string;
  tweet: EventId;
  author: NostrPublicType;
}
