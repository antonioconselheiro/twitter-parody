import { NostrUser } from "@domain/nostr-user";

export interface IProfile {
  npub: string;
  user: NostrUser;
  name?: string;
}
