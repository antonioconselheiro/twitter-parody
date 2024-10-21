/**
 * hyperlinks and multimidia related to the note
 */
export interface NoteResourcesContext {
  /**
   * Included hyperlinks
   */
  hyperlinks: string[];

  /**
   * Included images url
   */
  imageList: string[];

  /**
   * Included video url
   */
  videoList: string[];
}
