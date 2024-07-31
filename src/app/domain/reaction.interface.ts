import { TNostrPublic } from "@belomonte/nostr-ngx";
import { TEventId } from "./event-id.type";

export interface IReaction {
  id: TEventId;
  content: string;
  tweet: TEventId;
  author: TNostrPublic;
}
