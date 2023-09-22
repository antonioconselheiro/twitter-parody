import { Injectable } from "@angular/core";
import { nip19 } from "nostr-tools";

@Injectable()
export class ProfileConverter {
  castPubkeyToNostrPublic(pubkey: string): string {
    return nip19.npubEncode(pubkey);
  }
}