import { NPub } from "@belomonte/nostr-ngx";

export interface Reaction {
  id: string;
  content: string;
  tweet: string;
  author: NPub;
}
