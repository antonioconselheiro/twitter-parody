import { HexString } from "@belomonte/nostr-ngx";

export interface UnloadedFeedReferences {
  /**
   * pubkeys with no config event found
   */
  pubkey: HexString[];

  /**
   * events not found
   */
  idevent: HexString[];
}
