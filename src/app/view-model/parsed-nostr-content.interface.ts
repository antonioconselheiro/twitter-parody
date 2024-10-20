import { SafeHtml } from '@angular/platform-browser';

/**
 * Html structure with ready to render data available in cache.
 * To render simple note 'content' and user metadata 'about'.
 */
export interface ParsedNostrContent {

  /**
   * Original content that derivated the html
   */
  raw: string;

  /**
   * Default render of a nostr event, don't allow event get all screen if it's too large.
   * The promise will run in the first time it get acessed, this helps to be sure that all
   * needed information to compose the document is available in cache.
   */
  smallView: Promise<SafeHtml>;

  /**
   * Full render of a nostr event, when an event got user attention and wanna see it's full version if it's too large.
   * The promise will run in the first time it get acessed, this helps to be sure that all
   * needed information to compose the document is available in cache.
   */
  fullView: Promise<SafeHtml>;
}
