import { NoteContentSegmentViewModel } from "./note-content-segment.view-model";

export interface NoteContentSummarizedSegment {
  type: 'summarized';
  value: string;
  original: NoteContentSegmentViewModel;
}
