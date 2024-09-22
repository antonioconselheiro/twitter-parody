import { TNostrPublic } from "@belomonte/nostr-ngx";

export interface IReaction {
  id: string;
  content: string;
  tweet: string;
  author: TNostrPublic;
}
