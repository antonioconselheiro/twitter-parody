import { getPublicKey, nip19 } from 'nostr-tools';

export class NostrUser {

  /**
   * nsec
   */
  readonly nostrSecret: string | null;

  /**
   * npub
   */
  readonly nostrPublic: string;

  /**
   * nsec decoded
   */
  readonly privateKeyHex: string | null;

  /**
   * npub decoded
   */
  readonly publicKeyHex: string;
  
  constructor(
    /**
     * npub or nsec
     */
    readonly nostrString: string
  ) {
    const { type, data } = nip19.decode(nostrString);
    if (type === 'nsec') {
      this.nostrSecret = nostrString;
      this.privateKeyHex = data.toString();
      this.publicKeyHex = getPublicKey(this.privateKeyHex);
      this.nostrPublic = nip19.npubEncode(this.publicKeyHex);
    } else if (type === 'npub') {
      this.nostrPublic = nostrString;
      this.publicKeyHex = data.toString();
      this.nostrSecret = null;
      this.privateKeyHex = null;
    } else {
      throw new Error('Invalid argument, NostrUser expect nsec or npub string');
    }

  }

  toString(): string {
    return this.publicKeyHex;
  }
}