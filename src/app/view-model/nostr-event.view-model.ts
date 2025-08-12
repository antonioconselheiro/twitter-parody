import { AccountRaw, HexString, NostrEvent } from "@belomonte/nostr-ngx";
import { NostrEventIdViewModel } from "./nostr-event-id.view-model";
import { Note, NEvent } from 'nostr-tools/nip19';

/**
 * properties that all ready to render nostr event will bring
 */
export interface NostrEventViewModel extends NostrEventIdViewModel {

  /**
   * author account
   */
  author: AccountRaw;

  //  TODO: study how render it using angular date pipe and internacionalization
  //  TODO: in long term, include time2blocks alternative
  //  TODO: include lunar calendary
  /**
   * Event creation date in unix timestamp
   */
  readonly createdAt: number;

  readonly event: NostrEvent;

  readonly nevent: NEvent;

  readonly note: Note;

  /**
   * relays where this event was found
   */
  readonly origin: Array<WebSocket['url']>;

  /**
   * Events can be related in many ways, this list should contain all event ids mentioned by this event.
   */
  readonly relates: Array<HexString>;
}
