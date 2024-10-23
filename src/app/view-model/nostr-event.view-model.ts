/**
 * properties that all ready to render nostr event will bring
 */
export interface NostrEventViewModel {

  /**
   * hexadecimal event id
   */
  id: string;

  /**
   * author pubkey
   */
  author: string;

  //  TODO: study how render it using angular date pipe and internacionalization
  //  TODO: in long term, include time2blocks alternative
  /**
   * Event creation date in unix timestamp
   */
  createdAt: number;
}