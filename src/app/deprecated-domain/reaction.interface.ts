import { NPub } from 'nostr-tools/nip19';

export interface Reaction {
  id: string;
  content: string;
  tweet: string;
  author: NPub;
}
