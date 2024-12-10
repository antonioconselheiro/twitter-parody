import { SafeHtml } from "@angular/platform-browser";
import { NoteResourcesContext } from "@view-model/context/note-resources-context.interface";
import { ParsedNostrContent } from "@view-model/context/parsed-nostr-content.interface";

/**
 * this service must be able to convert the content
 * renderable safe html
 */
export interface NoteHtmlfier {

  parse(content: string): ParsedNostrContent;

  /**
   * Convert content from event note into html
   */
  safify(content: string): SafeHtml;

  /**
   * extract image url, video url and hyper links in the note content
   */
  extractMedia(content: string): NoteResourcesContext;
}
