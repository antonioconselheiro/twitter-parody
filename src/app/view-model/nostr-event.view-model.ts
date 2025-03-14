import { AccountRaw, HexString, NostrEvent } from "@belomonte/nostr-ngx";

/**
 * properties that all ready to render nostr event will bring
 */
export interface NostrEventViewModel {

  /**
   * hexadecimal event id
   */
  readonly id: HexString;

  /**
   * author account
   */
  author: AccountRaw;

  //  TODO: study how render it using angular date pipe and internacionalization
  //  TODO: in long term, include time2blocks alternative
  /**
   * Event creation date in unix timestamp
   */
  readonly createdAt: number;

  readonly event: NostrEvent;

  /**
   * relays where this event was found
   */
  readonly origin: Array<WebSocket['url']>
}
